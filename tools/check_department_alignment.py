#!/usr/bin/env python3
"""
Check and optionally align department / college office data against the uploaded checklist.

Run from project root.

Dry run only:
  python tools/check_department_alignment.py

Delete departments that exist in campusData but are NOT in the checklist:
  python tools/check_department_alignment.py --apply-delete

Update matching departments to checklist values:
  python tools/check_department_alignment.py --apply-align

Do both:
  python tools/check_department_alignment.py --apply-delete --apply-align

By default, empty checklist cells do NOT overwrite existing code values.
Use --allow-empty only if blank cells in the checklist should clear existing values.

This tool updates ONLY the departments array in:
  - client/src/data/campusData.ts
  - shared/campusData.ts

It does NOT modify:
  - serviceCategories
  - offices
  - tasks
  - service_categories arrays
  - latitude / longitude
  - google_maps_query
  - use_manual_coordinates
  - image paths
  - source_url
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Tuple


CHECKLIST_PATH = Path("data/department_checklist.json")
OUTPUT_PATH = Path("data/department_alignment_report.md")
DATA_FILES = [
    Path("client/src/data/campusData.ts"),
    Path("shared/campusData.ts"),
]

# Checklist field -> campusData field.
FIELD_MAP = {
    "學院（中）": "college_zh",
    "學院（英）": "college_en",
    "中文名稱": "name_zh",
    "英文名稱": "name_en",
    "樓層": "floor",
    "室號（中）": "room_zh",
    "室號（英）": "room_en",
    "完整地點顯示（中）★": "indoor_location_note_zh",
    "完整地點顯示（英）★": "indoor_location_note_en",
    "大樓（中）": "building_name_zh",
    "大樓（英）": "building_name_en",
    "功能描述（中）★": "function_desc_zh",
    "功能描述（英）★": "function_desc_en",
    "服務範圍（中）★": "service_scope_zh",
    "服務範圍（英）★": "service_scope_en",
    "官網": "official_url",
    "待確認": "needs_manual_review",
    "類型": "is_college_office",
}

BOOLEAN_FIELDS = {"needs_manual_review", "is_college_office"}


@dataclass
class Change:
    file: str
    department_id: str
    department_name: str
    field: str
    before: str
    after: str


@dataclass
class Skip:
    file: str
    department_id: str
    department_name: str
    field: str
    reason: str


def normalize_text(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip()


def checklist_bool(checklist_field: str, value: Any) -> bool:
    text = normalize_text(value)

    if checklist_field == "類型":
        return text == "院辦"

    if text in {"是", "true", "True", "TRUE", "1", "yes", "Yes", "YES"}:
        return True

    return False


def js_string(value: str) -> str:
    return (
        value
        .replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\r\n", "\\n")
        .replace("\n", "\\n")
    )


def extract_array_region(source: str, export_name: str) -> Tuple[int, int, str]:
    marker = f"export const {export_name}"
    start = source.find(marker)
    if start == -1:
        raise ValueError(f"Cannot find {marker}")

    equals_pos = source.find("=", start)
    if equals_pos == -1:
        raise ValueError(f"Cannot find assignment for {export_name}")

    bracket_start = source.find("[", equals_pos)
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


def get_string_value(block: str, key: str) -> str:
    m = re.search(rf'"{re.escape(key)}"\s*:\s*"((?:\\.|[^"\\])*)"', block, re.S)
    if not m:
        return ""
    return m.group(1)


def get_bool_value(block: str, key: str) -> bool | None:
    m = re.search(rf'"{re.escape(key)}"\s*:\s*(true|false)\b', block)
    if not m:
        return None
    return m.group(1) == "true"


def has_key(block: str, key: str) -> bool:
    return re.search(rf'"{re.escape(key)}"\s*:', block) is not None


def insert_property_before_closing(block: str, key: str, value_src: str) -> str:
    lines = block.splitlines()
    if len(lines) < 2:
        return block

    closing_index = len(lines) - 1
    last_prop_index = closing_index - 1

    while last_prop_index > 0 and not lines[last_prop_index].strip():
        last_prop_index -= 1

    if not lines[last_prop_index].rstrip().endswith(","):
        lines[last_prop_index] = lines[last_prop_index].rstrip() + ","

    indent_match = re.match(r"(\s*)", lines[last_prop_index])
    indent = indent_match.group(1) if indent_match else "    "
    lines.insert(closing_index, f'{indent}"{key}": {value_src}')
    return "\n".join(lines)


def update_string_property(block: str, key: str, value: str) -> str:
    value_src = f'"{js_string(value)}"'
    pattern = re.compile(rf'(\n\s*"{re.escape(key)}"\s*:\s*)"((?:\\.|[^"\\])*)"(,?)', re.S)
    if pattern.search(block):
        return pattern.sub(rf'\1{value_src}\3', block, count=1)
    return insert_property_before_closing(block, key, value_src)


def update_bool_property(block: str, key: str, value: bool) -> str:
    value_src = "true" if value else "false"
    pattern = re.compile(rf'(\n\s*"{re.escape(key)}"\s*:\s*)(true|false)(,?)')
    if pattern.search(block):
        return pattern.sub(rf'\1{value_src}\3', block, count=1)

    # For optional is_college_office, do not add explicit false when missing.
    if key == "is_college_office" and value is False:
        return block

    return insert_property_before_closing(block, key, value_src)


def update_department_block(
    block: str,
    checklist_row: Dict[str, Any],
    allow_empty: bool,
    file_label: str,
) -> Tuple[str, List[Change], List[Skip]]:
    department_id = get_id(block) or ""
    department_name = normalize_text(checklist_row.get("中文名稱"))
    changes: List[Change] = []
    skips: List[Skip] = []
    updated = block

    for checklist_field, code_field in FIELD_MAP.items():
        expected_raw = checklist_row.get(checklist_field)

        if code_field in BOOLEAN_FIELDS:
            expected_bool = checklist_bool(checklist_field, expected_raw)
            current_bool = get_bool_value(updated, code_field)

            # Missing optional is_college_office means false.
            if code_field == "is_college_office" and current_bool is None:
                current_bool = False

            current_text = "" if current_bool is None else ("true" if current_bool else "false")
            expected_text = "true" if expected_bool else "false"

            if current_text != expected_text:
                changes.append(Change(file_label, department_id, department_name, code_field, current_text, expected_text))
                updated = update_bool_property(updated, code_field, expected_bool)
            continue

        expected = normalize_text(expected_raw)
        if expected == "" and not allow_empty:
            skips.append(Skip(file_label, department_id, department_name, code_field, "checklist cell is empty; skipped by default"))
            continue

        current = get_string_value(updated, code_field)
        if current != expected:
            changes.append(Change(file_label, department_id, department_name, code_field, current, expected))
            updated = update_string_property(updated, code_field, expected)

    return updated, changes, skips


def remove_objects_from_array_text(array_text: str, object_ranges_to_delete: List[Tuple[int, int]]) -> str:
    text = array_text
    for start, end in reversed(object_ranges_to_delete):
        new_end = end
        while new_end < len(text) and text[new_end] in " \t\r\n":
            new_end += 1
        if new_end < len(text) and text[new_end] == ",":
            new_end += 1
        else:
            new_start = start
            while new_start > 0 and text[new_start - 1] in " \t\r\n":
                new_start -= 1
            if new_start > 0 and text[new_start - 1] == ",":
                new_start -= 1
            start = new_start
        text = text[:start] + text[new_end:]
    return text


def update_file(
    path: Path,
    checklist_by_id: Dict[str, Dict[str, Any]],
    apply_delete: bool,
    apply_align: bool,
    allow_empty: bool,
) -> Tuple[str, List[str], List[str], List[Change], List[Skip]]:
    source = path.read_text(encoding="utf-8")
    array_start, array_end, array_text = extract_array_region(source, "departments")
    objects = iter_top_level_objects_with_positions(array_text)

    code_ids = set()
    missing_from_checklist: List[str] = []
    missing_from_code: List[str] = []
    changes: List[Change] = []
    skips: List[Skip] = []
    replacements: List[Tuple[int, int, str]] = []
    delete_ranges: List[Tuple[int, int]] = []

    for obj_start, obj_end, block in objects:
        department_id = get_id(block)
        if not department_id:
            continue
        code_ids.add(department_id)

        row = checklist_by_id.get(department_id)
        if row is None:
            missing_from_checklist.append(department_id)
            if apply_delete:
                delete_ranges.append((obj_start, obj_end))
            continue

        new_block, block_changes, block_skips = update_department_block(
            block,
            row,
            allow_empty,
            path.as_posix(),
        )
        changes.extend(block_changes)
        skips.extend(block_skips)

        if apply_align and new_block != block:
            replacements.append((obj_start, obj_end, new_block))

    for department_id in sorted(checklist_by_id):
        if department_id not in code_ids:
            missing_from_code.append(department_id)

    new_array = array_text

    if apply_align:
        for start, end, new_block in reversed(replacements):
            new_array = new_array[:start] + new_block + new_array[end:]

    if apply_delete:
        new_array = remove_objects_from_array_text(new_array, delete_ranges)

    new_source = source[:array_start] + new_array + source[array_end:]
    return new_source, sorted(missing_from_checklist), sorted(missing_from_code), changes, skips


def write_report(
    mode: str,
    delete_candidates: Dict[str, List[str]],
    missing_from_code: Dict[str, List[str]],
    changes: List[Change],
    skips: List[Skip],
    allow_empty: bool,
) -> None:
    lines: List[str] = []
    lines.append("# Department Alignment Report")
    lines.append("")
    lines.append(f"- Mode: {mode}")
    lines.append(f"- Empty checklist cells overwrite code: {'yes' if allow_empty else 'no'}")
    lines.append(f"- Total field differences: {len(changes)}")
    lines.append("")

    lines.append("## Departments existing in code but not in checklist")
    lines.append("These are the main candidates to delete if the checklist is the source of truth.")
    for file_label, ids in delete_candidates.items():
        lines.append("")
        lines.append(f"### {file_label}")
        if ids:
            for department_id in ids:
                lines.append(f"- `{department_id}`")
        else:
            lines.append("- None")
    lines.append("")

    lines.append("## Departments in checklist but missing from code")
    for file_label, ids in missing_from_code.items():
        lines.append("")
        lines.append(f"### {file_label}")
        if ids:
            for department_id in ids:
                lines.append(f"- `{department_id}`")
        else:
            lines.append("- None")
    lines.append("")

    lines.append("## Field differences for matching department ids")
    if changes:
        current_file = None
        for ch in changes[:800]:
            if ch.file != current_file:
                current_file = ch.file
                lines.append("")
                lines.append(f"### {current_file}")
            lines.append(f"- `{ch.department_id}` {ch.department_name} / `{ch.field}`")
            lines.append(f"  - code: `{ch.before}`")
            lines.append(f"  - checklist: `{ch.after}`")
        if len(changes) > 800:
            lines.append(f"- ...and {len(changes) - 800} more field differences")
    else:
        lines.append("- None")
    lines.append("")

    skipped_empty = [s for s in skips if "empty" in s.reason]
    if skipped_empty:
        lines.append("## Skipped empty checklist cells")
        lines.append("These were not applied because --allow-empty was not used.")
        for sk in skipped_empty[:200]:
            lines.append(f"- `{sk.department_id}` {sk.department_name} / `{sk.field}`")
        if len(skipped_empty) > 200:
            lines.append(f"- ...and {len(skipped_empty) - 200} more")
        lines.append("")

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply-delete", action="store_true", help="Delete departments that exist in code but not in the checklist.")
    parser.add_argument("--apply-align", action="store_true", help="Update matching departments to checklist values.")
    parser.add_argument("--allow-empty", action="store_true", help="Allow blank checklist cells to overwrite existing values.")
    args = parser.parse_args()

    if not CHECKLIST_PATH.exists():
        print(f"ERROR: missing {CHECKLIST_PATH}")
        return 1

    checklist = json.loads(CHECKLIST_PATH.read_text(encoding="utf-8"))
    checklist_by_id = {
        normalize_text(row.get("id（程式用）")): row
        for row in checklist
        if normalize_text(row.get("id（程式用）"))
    }

    all_delete_candidates: Dict[str, List[str]] = {}
    all_missing_from_code: Dict[str, List[str]] = {}
    all_changes: List[Change] = []
    all_skips: List[Skip] = []
    pending_writes: List[Tuple[Path, str]] = []

    for path in DATA_FILES:
        if not path.exists():
            print(f"ERROR: missing {path}")
            return 1

        updated_source, delete_candidates, missing_from_code, changes, skips = update_file(
            path,
            checklist_by_id,
            args.apply_delete,
            args.apply_align,
            args.allow_empty,
        )
        all_delete_candidates[path.as_posix()] = delete_candidates
        all_missing_from_code[path.as_posix()] = missing_from_code
        all_changes.extend(changes)
        all_skips.extend(skips)

        if args.apply_delete or args.apply_align:
            pending_writes.append((path, updated_source))

    mode_parts = []
    if args.apply_delete:
        mode_parts.append("apply-delete")
    if args.apply_align:
        mode_parts.append("apply-align")
    mode = "+".join(mode_parts) if mode_parts else "dry-run"

    write_report(mode, all_delete_candidates, all_missing_from_code, all_changes, all_skips, args.allow_empty)

    print(f"Mode: {mode}")
    print(f"Checklist department ids: {len(checklist_by_id)}")
    for file_label, ids in all_delete_candidates.items():
        print(f"{file_label}: departments to delete = {len(ids)}")
        if ids:
            print("  " + ", ".join(ids[:80]))
            if len(ids) > 80:
                print(f"  ...and {len(ids) - 80} more")
    print(f"Field differences found: {len(all_changes)}")
    print(f"Report written to: {OUTPUT_PATH}")

    if not (args.apply_delete or args.apply_align):
        print("\nDry run only. No campusData files were modified.")
        print("To delete departments not in checklist:")
        print("  python tools/check_department_alignment.py --apply-delete")
        print("To update matching departments to checklist values:")
        print("  python tools/check_department_alignment.py --apply-align")
        return 0

    for path, updated_source in pending_writes:
        path.write_text(updated_source, encoding="utf-8")
        print(f"Updated: {path}")

    print("\nNext checks:")
    print("  pnpm build")
    print("  git diff -- client/src/data/campusData.ts shared/campusData.ts")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
