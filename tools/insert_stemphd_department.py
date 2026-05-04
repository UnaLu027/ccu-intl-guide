#!/usr/bin/env python3
"""
Insert or update STEM PhD Program department data in campusData.ts.

Run from project root.

Preview only:
  python tools/insert_stemphd_department.py

Apply:
  python tools/insert_stemphd_department.py --apply

This tool updates ONLY the departments array in:
  - client/src/data/campusData.ts
  - shared/campusData.ts

It inserts the object after `college_science_office` when possible.
If `stemphd` already exists, it replaces that object with the canonical version below.

It does NOT modify offices, tasks, serviceCategories, images, or any other department.
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path
from typing import List, Tuple

DATA_FILES = [
    Path("client/src/data/campusData.ts"),
    Path("shared/campusData.ts"),
]

STEMPHD_OBJECT = '{\n  "id": "stemphd",\n  "name_zh": "跨領域科學國際博士學位學程",\n  "name_en": "STEM PhD Program",\n  "category": "department",\n  "college_zh": "理學院",\n  "college_en": "College of Science",\n  "building_name_zh": "理學院一館",\n  "building_name_en": "College of Science (Building 1)",\n  "floor": "3F",\n  "room_zh": "R302",\n  "room_en": "Room R302",\n  "indoor_location_note_zh": "理學院一館 3F R302",\n  "indoor_location_note_en": "College of Science (Building 1) · 3F Room R302",\n  "function_desc_zh": "辦理跨領域科學國際博士學位學程相關行政業務，包含學程聯繫、學生事務協助與學程辦公室諮詢。",\n  "function_desc_en": "Handles administrative affairs for the STEM PhD Program, including program contact, student-related support, and office inquiries.",\n  "service_scope_zh": "跨領域科學國際博士學位學程行政聯繫、學生事務協助、學程資訊與辦公室諮詢。行政助理：鄭小姐；電話：+886-(0)5-272-0411 ext. 61004；Fax：+886-(0)5-272-0728；Email：cosia@ccu.edu.tw。",\n  "service_scope_en": "Administrative contact, student-related assistance, program information, and office inquiries for the STEM PhD Program. Administrative Assistant: Ms. Cheng; Tel: +886-(0)5-272-0411 ext. 61004; Fax: +886-(0)5-272-0728; E-mail: cosia@ccu.edu.tw.",\n  "service_categories": [\n    "department_offices"\n  ],\n  "official_url": "",\n  "google_maps_query": "國立中正大學理學院一館",\n  "latitude": 23.56448754107089,\n  "longitude": 120.47611187883976,\n  "use_manual_coordinates": true,\n  "source_url": "",\n  "needs_manual_review": false\n}'


def extract_array_region(source: str, export_name: str) -> Tuple[int, int, str]:
    marker = f"export const {export_name}"
    start = source.find(marker)
    if start == -1:
        raise ValueError(f"Cannot find {marker}")

    bracket_start = source.find("[", start)
    if bracket_start == -1:
        raise ValueError(f"Cannot find array start for {export_name}")

    depth = 0
    in_string = False
    escape = False

    for i in range(bracket_start, len(source)):
        ch = source[i]

        if in_string:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                in_string = False
            continue

        if ch == '"':
            in_string = True
        elif ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                return bracket_start, i + 1, source[bracket_start:i + 1]

    raise ValueError(f"Cannot find array end for {export_name}")


def iter_top_level_objects_with_positions(array_text: str) -> List[Tuple[int, int, str]]:
    objects: List[Tuple[int, int, str]] = []
    depth = 0
    in_string = False
    escape = False
    obj_start: int | None = None

    for i, ch in enumerate(array_text):
        if in_string:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                in_string = False
            continue

        if ch == '"':
            in_string = True
        elif ch == "{":
            if depth == 0:
                obj_start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and obj_start is not None:
                objects.append((obj_start, i + 1, array_text[obj_start:i + 1]))
                obj_start = None

    return objects


def get_id(block: str) -> str | None:
    m = re.search(r'"id"\s*:\s*"([^"]+)"', block)
    return m.group(1) if m else None


def update_array_text(array_text: str) -> Tuple[str, str]:
    objects = iter_top_level_objects_with_positions(array_text)

    for start, end, block in objects:
        if get_id(block) == "stemphd":
            return array_text[:start] + STEMPHD_OBJECT + array_text[end:], "updated existing stemphd"

    for start, end, block in objects:
        if get_id(block) == "college_science_office":
            return array_text[:end] + ",\n  " + STEMPHD_OBJECT + array_text[end:], "inserted after college_science_office"

    for start, end, block in objects:
        if get_id(block) == "math":
            return array_text[:start] + STEMPHD_OBJECT + ",\n  " + array_text[start:], "inserted before math"

    bracket = array_text.find("[")
    if bracket == -1:
        raise ValueError("Invalid departments array")
    return array_text[:bracket + 1] + "\n  " + STEMPHD_OBJECT + "," + array_text[bracket + 1:], "inserted at start of departments"


def update_file(path: Path) -> Tuple[str, str, bool]:
    original = path.read_text(encoding="utf-8")
    start, end, array_text = extract_array_region(original, "departments")
    new_array_text, action = update_array_text(array_text)
    updated = original[:start] + new_array_text + original[end:]
    return updated, action, updated != original


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Actually write changes to campusData files.")
    args = parser.parse_args()

    mode = "apply" if args.apply else "dry-run"
    print(f"Mode: {mode}")

    pending = []
    for path in DATA_FILES:
        if not path.exists():
            print(f"ERROR: missing {path}")
            return 1

        updated, action, changed = update_file(path)
        print(f"{path}: {action}; changed={changed}")
        if changed:
            pending.append((path, updated))

    if not args.apply:
        print("\nDry run only. To apply:")
        print("  python tools/insert_stemphd_department.py --apply")
        return 0

    for path, updated in pending:
        path.write_text(updated, encoding="utf-8")
        print(f"Updated: {path}")

    print("\nNext checks:")
    print("  pnpm build")
    print("  git diff -- client/src/data/campusData.ts shared/campusData.ts")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
