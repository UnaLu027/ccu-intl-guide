#!/usr/bin/env python3
"""
Apply uploaded office checklist values to campusData.ts safely.

Run from project root.

Dry run only:
  python tools/apply_office_checklist.py

Apply updates:
  python tools/apply_office_checklist.py --apply

Apply updates and allow checklist empty cells to overwrite code with "":
  python tools/apply_office_checklist.py --apply --allow-empty

This tool updates ONLY the offices array in:
  - client/src/data/campusData.ts
  - shared/campusData.ts

It does NOT modify:
  - serviceCategories
  - departments
  - tasks
  - service_categories arrays
  - latitude / longitude
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


CHECKLIST_PATH = Path("data/office_checklist.json")
OUTPUT_PATH = Path("data/office_apply_report.md")
DATA_FILES = [
    Path("client/src/data/campusData.ts"),
    Path("shared/campusData.ts"),
]

# Checklist field -> campusData field.
FIELD_MAP = {
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
    "常見情境（中）★": "common_scenarios_zh",
    "常見情境（英）★": "common_scenarios_en",
    "辦公時間": "office_hours",
    "電話": "phone",
    "Email": "email",
    "官網": "official_url",
    "待確認": "needs_manual_review",
}

BOOLEAN_FIELDS = {"needs_manual_review"}


@dataclass
class Change:
    file: str
    office_id: str
    office_name: str
    field: str
    before: str
    after: str


@dataclass
class Skip:
    file: str
    office_id: str
    office_name: str
    field: str
    reason: str


def normalize_text(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip()


def checklist_bool(value: Any) -> bool:
    text = normalize_text(value)
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


def get_string_value(block: str, key: str) -> str:
    m = re.search(rf'"{re.escape(key)}"\s*:\s*"((?:\\.|[^"\\])*)"', block, re.S)
    if not m:
        return ""
    return bytes(m.group(1), "utf-8").decode("unicode_escape")


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
    return insert_property_before_closing(block, key, value_src)


def update_office_block(
    block: str,
    checklist_row: Dict[str, Any],
    allow_empty: bool,
    file_label: str,
) -> Tuple[str, List[Change], List[Skip]]:
    office_id = get_id(block) or ""
    office_name = normalize_text(checklist_row.get("中文名稱"))
    changes: List[Change] = []
    skips: List[Skip] = []
    updated = block

    for checklist_field, code_field in FIELD_MAP.items():
        expected_raw = checklist_row.get(checklist_field)

        if code_field in BOOLEAN_FIELDS:
            expected_bool = checklist_bool(expected_raw)
            current_bool = get_bool_value(updated, code_field)
            current_text = "" if current_bool is None else ("true" if current_bool else "false")
            expected_text = "true" if expected_bool else "false"

            if current_text != expected_text:
                changes.append(Change(file_label, office_id, office_name, code_field, current_text, expected_text))
                updated = update_bool_property(updated, code_field, expected_bool)
            continue

        expected = normalize_text(expected_raw)
        if expected == "" and not allow_empty:
            skips.append(Skip(file_label, office_id, office_name, code_field, "checklist cell is empty; skipped by default"))
            continue

        current = get_string_value(updated, code_field)
        if current != expected:
            changes.append(Change(file_label, office_id, office_name, code_field, current, expected))
            updated = update_string_property(updated, code_field, expected)

    return updated, changes, skips


def update_file(path: Path, checklist_by_id: Dict[str, Dict[str, Any]], allow_empty: bool) -> Tuple[str, List[Change], List[Skip], List[str]]:
    source = path.read_text(encoding="utf-8")
    array_start, array_end, array_text = extract_array_region(source, "offices")
    objects = iter_top_level_objects_with_positions(array_text)

    replacements: List[Tuple[int, int, str]] = []
    all_changes: List[Change] = []
    all_skips: List[Skip] = []
    missing_ids: List[str] = []

    found_ids = set()

    for obj_start, obj_end, block in objects:
        office_id = get_id(block)
        if not office_id:
            continue
        found_ids.add(office_id)

        row = checklist_by_id.get(office_id)
        if not row:
            continue

        new_block, changes, skips = update_office_block(block, row, allow_empty, path.as_posix())
        if new_block != block:
            replacements.append((obj_start, obj_end, new_block))
        all_changes.extend(changes)
        all_skips.extend(skips)

    for expected_id in sorted(checklist_by_id):
        if expected_id not in found_ids:
            missing_ids.append(expected_id)

    new_array_text = array_text
    for obj_start, obj_end, new_block in reversed(replacements):
        new_array_text = new_array_text[:obj_start] + new_block + new_array_text[obj_end:]

    new_source = source[:array_start] + new_array_text + source[array_end:]
    return new_source, all_changes, all_skips, missing_ids


def write_report(mode: str, changes: List[Change], skips: List[Skip], missing: Dict[str, List[str]], allow_empty: bool) -> None:
    lines: List[str] = []
    lines.append("# Office Checklist Apply Report")
    lines.append("")
    lines.append(f"- Mode: {mode}")
    lines.append(f"- Empty checklist cells overwrite code: {'yes' if allow_empty else 'no'}")
    lines.append(f"- Total field changes: {len(changes)}")
    lines.append("")

    if changes:
        lines.append("## Changes")
        current_file = None
        for ch in changes:
            if ch.file != current_file:
                current_file = ch.file
                lines.append("")
                lines.append(f"### {current_file}")
            lines.append(f"- `{ch.office_id}` {ch.office_name} / `{ch.field}`")
            lines.append(f"  - before: `{ch.before}`")
            lines.append(f"  - after: `{ch.after}`")
        lines.append("")

    if missing:
        lines.append("## Checklist ids missing from campusData offices")
        for file_label, ids in missing.items():
            if ids:
                lines.append(f"- {file_label}: {', '.join(ids)}")
        lines.append("")

    skipped_nonempty = [s for s in skips if "empty" in s.reason]
    if skipped_nonempty:
        lines.append("## Skipped empty checklist cells")
        lines.append("These were not applied because --allow-empty was not used.")
        for sk in skipped_nonempty[:200]:
            lines.append(f"- `{sk.office_id}` {sk.office_name} / `{sk.field}`")
        if len(skipped_nonempty) > 200:
            lines.append(f"- ...and {len(skipped_nonempty) - 200} more")
        lines.append("")

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Actually write changes to campusData files.")
    parser.add_argument("--allow-empty", action="store_true", help="Allow empty checklist cells to overwrite existing code values with ''.")
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

    all_changes: List[Change] = []
    all_skips: List[Skip] = []
    all_missing: Dict[str, List[str]] = {}
    pending_writes: List[Tuple[Path, str]] = []

    for path in DATA_FILES:
        if not path.exists():
            print(f"ERROR: missing {path}")
            return 1

        updated_source, changes, skips, missing_ids = update_file(path, checklist_by_id, args.allow_empty)
        all_changes.extend(changes)
        all_skips.extend(skips)
        all_missing[path.as_posix()] = missing_ids

        if changes:
            pending_writes.append((path, updated_source))

    mode = "apply" if args.apply else "dry-run"
    write_report(mode, all_changes, all_skips, all_missing, args.allow_empty)

    print(f"Mode: {mode}")
    print(f"Checklist office ids: {len(checklist_by_id)}")
    print(f"Field changes detected: {len(all_changes)}")
    print(f"Report written to: {OUTPUT_PATH}")

    missing_total = sum(len(ids) for ids in all_missing.values())
    if missing_total:
        print(f"WARNING: checklist ids missing from offices arrays: {missing_total}")

    if not args.apply:
        print("\nDry run only. No campusData files were modified.")
        print("To apply these changes, run:")
        print("  python tools/apply_office_checklist.py --apply")
        print("\nIf you intentionally want blank checklist cells to clear code values, run:")
        print("  python tools/apply_office_checklist.py --apply --allow-empty")
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
