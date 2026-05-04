#!/usr/bin/env python3
"""
Check and optionally align common tasks against the uploaded task checklist.

Run from project root.

Dry run only:
  python tools/check_task_alignment.py

Delete tasks that exist in campusData but are NOT in the checklist:
  python tools/check_task_alignment.py --apply-delete

Update matching tasks to checklist values:
  python tools/check_task_alignment.py --apply-align

Do both:
  python tools/check_task_alignment.py --apply-delete --apply-align

By default, empty checklist cells do NOT overwrite existing code values.
Use --allow-empty only if blank cells in the checklist should clear existing values.

This tool updates ONLY the tasks array in:
  - client/src/data/campusData.ts
  - shared/campusData.ts

It does NOT modify:
  - serviceCategories
  - offices
  - departments
  - coordinates
  - image paths
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Tuple


CHECKLIST_PATH = Path("data/task_checklist.json")
OUTPUT_PATH = Path("data/task_alignment_report.md")
DATA_FILES = [
    Path("client/src/data/campusData.ts"),
    Path("shared/campusData.ts"),
]

FIELD_MAP = {
    "任務名稱（中）★": "task_name_zh",
    "任務名稱（英）★": "task_name_en",
    "情境描述（中）★": "scenario_zh",
    "情境描述（英）★": "scenario_en",
    "負責單位 id": "target_unit_id",
    "所需文件（中）★": "required_documents_zh",
    "所需文件（英）★": "required_documents_en",
    "步驟（中）★": "steps.zh",
    "步驟（英）★": "steps.en",
}

TARGET_UNIT_TYPE_DEFAULT = "office"


@dataclass
class Change:
    file: str
    task_id: str
    task_name: str
    field: str
    before: str
    after: str


def normalize_text(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip()


def split_multiline_list(value: Any) -> List[str]:
    text = normalize_text(value)
    if not text:
        return []
    lines = [line.strip() for line in text.replace("\r\n", "\n").split("\n")]
    return [line for line in lines if line]


def split_numbered_steps(value: Any) -> List[str]:
    text = normalize_text(value)
    if not text:
        return []
    lines = [line.strip() for line in text.replace("\r\n", "\n").split("\n") if line.strip()]
    steps: List[str] = []
    current = ""

    for line in lines:
        if re.match(r"^\d+[\.\、)]\s*", line):
            if current:
                steps.append(current.strip())
            current = re.sub(r"^\d+[\.\、)]\s*", "", line).strip()
        else:
            if current:
                current += "\n" + line
            else:
                current = line

    if current:
        steps.append(current.strip())
    return steps


def js_string(value: str) -> str:
    return (
        value
        .replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\r\n", "\\n")
        .replace("\n", "\\n")
    )


def js_string_array(values: List[str]) -> str:
    if not values:
        return "[]"
    inner = ", ".join(f'"{js_string(v)}"' for v in values)
    return f"[{inner}]"


def js_steps_array(zh_steps: List[str], en_steps: List[str]) -> str:
    max_len = max(len(zh_steps), len(en_steps))
    if max_len == 0:
        return "[]"
    items = []
    for i in range(max_len):
        zh = zh_steps[i] if i < len(zh_steps) else ""
        en = en_steps[i] if i < len(en_steps) else ""
        items.append(f'{{ zh: "{js_string(zh)}", en: "{js_string(en)}" }}')
    return "[" + ", ".join(items) + "]"


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


def get_string_array(block: str, key: str) -> List[str]:
    m = re.search(rf'"{re.escape(key)}"\s*:\s*\[([\s\S]*?)\]', block)
    if not m:
        return []
    inside = m.group(1)
    values = re.findall(r'"((?:\\.|[^"\\])*)"', inside)
    return [bytes(v, "utf-8").decode("unicode_escape") for v in values]


def get_steps(block: str) -> Tuple[List[str], List[str]]:
    m = re.search(r'"steps"\s*:\s*\[([\s\S]*?)\]\s*(?:,|\n\s*})', block)
    if not m:
        return [], []
    inside = m.group(1)
    objs = re.findall(r'\{([\s\S]*?)\}', inside)
    zh, en = [], []
    for obj in objs:
        zh_m = re.search(r'zh\s*:\s*"((?:\\.|[^"\\])*)"', obj)
        en_m = re.search(r'en\s*:\s*"((?:\\.|[^"\\])*)"', obj)
        zh.append(bytes(zh_m.group(1), "utf-8").decode("unicode_escape") if zh_m else "")
        en.append(bytes(en_m.group(1), "utf-8").decode("unicode_escape") if en_m else "")
    return zh, en


def replace_string_property(block: str, key: str, value: str) -> str:
    value_src = f'"{js_string(value)}"'
    pattern = re.compile(rf'(\n\s*"{re.escape(key)}"\s*:\s*)"((?:\\.|[^"\\])*)"(,?)', re.S)
    if pattern.search(block):
        return pattern.sub(rf'\1{value_src}\3', block, count=1)
    return insert_property_before_closing(block, key, value_src)


def replace_array_property(block: str, key: str, value_src: str) -> str:
    pattern = re.compile(rf'(\n\s*"{re.escape(key)}"\s*:\s*)\[[\s\S]*?\](,?)', re.S)
    if pattern.search(block):
        return pattern.sub(rf'\1{value_src}\2', block, count=1)
    return insert_property_before_closing(block, key, value_src)


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


def expected_for_field(row: Dict[str, Any], field: str) -> Any:
    if field == "required_documents_zh":
        return split_multiline_list(row.get("所需文件（中）★"))
    if field == "required_documents_en":
        return split_multiline_list(row.get("所需文件（英）★"))
    if field == "steps.zh":
        return split_numbered_steps(row.get("步驟（中）★"))
    if field == "steps.en":
        return split_numbered_steps(row.get("步驟（英）★"))

    checklist_key = next(k for k, v in FIELD_MAP.items() if v == field)
    return normalize_text(row.get(checklist_key))


def current_for_field(block: str, field: str) -> Any:
    if field == "required_documents_zh":
        return get_string_array(block, "required_documents_zh")
    if field == "required_documents_en":
        return get_string_array(block, "required_documents_en")
    if field == "steps.zh":
        return get_steps(block)[0]
    if field == "steps.en":
        return get_steps(block)[1]
    return get_string_value(block, field)


def value_to_display(value: Any) -> str:
    if isinstance(value, list):
        return " | ".join(value)
    return str(value)


def update_task_block(block: str, row: Dict[str, Any], allow_empty: bool, file_label: str) -> Tuple[str, List[Change]]:
    task_id = get_id(block) or ""
    task_name = normalize_text(row.get("任務名稱（中）★"))
    changes: List[Change] = []
    updated = block

    # Normal scalar fields and document arrays.
    for checklist_key, field in FIELD_MAP.items():
        if field.startswith("steps."):
            continue

        expected = expected_for_field(row, field)
        if (expected == "" or expected == []) and not allow_empty:
            continue

        current = current_for_field(updated, field)
        if current != expected:
            changes.append(Change(file_label, task_id, task_name, field, value_to_display(current), value_to_display(expected)))
            if isinstance(expected, list):
                updated = replace_array_property(updated, field, js_string_array(expected))
            else:
                updated = replace_string_property(updated, field, expected)

    # Steps are updated together because zh/en are one `steps` array in code.
    expected_zh = expected_for_field(row, "steps.zh")
    expected_en = expected_for_field(row, "steps.en")
    current_zh, current_en = get_steps(updated)

    if (expected_zh or expected_en or allow_empty) and (current_zh != expected_zh or current_en != expected_en):
        changes.append(Change(file_label, task_id, task_name, "steps", value_to_display(current_zh) + " / " + value_to_display(current_en), value_to_display(expected_zh) + " / " + value_to_display(expected_en)))
        updated = replace_array_property(updated, "steps", js_steps_array(expected_zh, expected_en))

    return updated, changes


def remove_objects_from_array_text(array_text: str, object_ranges_to_delete: List[Tuple[int, int]]) -> str:
    text = array_text
    for start, end in reversed(object_ranges_to_delete):
        # Include following comma/newlines when possible.
        new_end = end
        while new_end < len(text) and text[new_end] in " \t\r\n":
            new_end += 1
        if new_end < len(text) and text[new_end] == ",":
            new_end += 1
        else:
            # Otherwise remove preceding comma.
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
) -> Tuple[str, List[str], List[str], List[Change]]:
    source = path.read_text(encoding="utf-8")
    array_start, array_end, array_text = extract_array_region(source, "tasks")
    objects = iter_top_level_objects_with_positions(array_text)

    code_ids = set()
    missing_from_checklist: List[str] = []
    missing_from_code: List[str] = []
    changes: List[Change] = []
    replacements: List[Tuple[int, int, str]] = []
    delete_ranges: List[Tuple[int, int]] = []

    for obj_start, obj_end, block in objects:
        task_id = get_id(block)
        if not task_id:
            continue
        code_ids.add(task_id)

        row = checklist_by_id.get(task_id)
        if row is None:
            missing_from_checklist.append(task_id)
            if apply_delete:
                delete_ranges.append((obj_start, obj_end))
            continue

        if apply_align:
            new_block, block_changes = update_task_block(block, row, allow_empty, path.as_posix())
            if new_block != block:
                replacements.append((obj_start, obj_end, new_block))
            changes.extend(block_changes)
        else:
            # Still report mismatches in dry-run / non-align mode.
            _, block_changes = update_task_block(block, row, allow_empty, path.as_posix())
            changes.extend(block_changes)

    for task_id in sorted(checklist_by_id):
        if task_id not in code_ids:
            missing_from_code.append(task_id)

    new_array = array_text

    if apply_align:
        for start, end, new_block in reversed(replacements):
            new_array = new_array[:start] + new_block + new_array[end:]

    if apply_delete:
        new_array = remove_objects_from_array_text(new_array, delete_ranges)

    new_source = source[:array_start] + new_array + source[array_end:]
    return new_source, sorted(missing_from_checklist), sorted(missing_from_code), changes


def write_report(
    mode: str,
    delete_candidates: Dict[str, List[str]],
    missing_from_code: Dict[str, List[str]],
    changes: List[Change],
) -> None:
    lines: List[str] = []
    lines.append("# Task Alignment Report")
    lines.append("")
    lines.append(f"- Mode: {mode}")
    lines.append("")

    lines.append("## Tasks existing in code but not in checklist")
    lines.append("These are the main candidates to delete if the checklist is the source of truth.")
    for file_label, ids in delete_candidates.items():
        lines.append("")
        lines.append(f"### {file_label}")
        if ids:
            for task_id in ids:
                lines.append(f"- `{task_id}`")
        else:
            lines.append("- None")
    lines.append("")

    lines.append("## Tasks in checklist but missing from code")
    for file_label, ids in missing_from_code.items():
        lines.append("")
        lines.append(f"### {file_label}")
        if ids:
            for task_id in ids:
                lines.append(f"- `{task_id}`")
        else:
            lines.append("- None")
    lines.append("")

    lines.append("## Field differences for matching task ids")
    if changes:
        current_file = None
        for ch in changes[:500]:
            if ch.file != current_file:
                current_file = ch.file
                lines.append("")
                lines.append(f"### {current_file}")
            lines.append(f"- `{ch.task_id}` {ch.task_name} / `{ch.field}`")
            lines.append(f"  - code: `{ch.before}`")
            lines.append(f"  - checklist: `{ch.after}`")
        if len(changes) > 500:
            lines.append(f"- ...and {len(changes) - 500} more field differences")
    else:
        lines.append("- None")
    lines.append("")

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply-delete", action="store_true", help="Delete tasks that exist in code but not in the checklist.")
    parser.add_argument("--apply-align", action="store_true", help="Update matching tasks to checklist values.")
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
    pending_writes: List[Tuple[Path, str]] = []

    for path in DATA_FILES:
        if not path.exists():
            print(f"ERROR: missing {path}")
            return 1

        updated_source, delete_candidates, missing_from_code, changes = update_file(
            path,
            checklist_by_id,
            args.apply_delete,
            args.apply_align,
            args.allow_empty,
        )
        all_delete_candidates[path.as_posix()] = delete_candidates
        all_missing_from_code[path.as_posix()] = missing_from_code
        all_changes.extend(changes)

        if args.apply_delete or args.apply_align:
            pending_writes.append((path, updated_source))

    mode_parts = []
    if args.apply_delete:
        mode_parts.append("apply-delete")
    if args.apply_align:
        mode_parts.append("apply-align")
    mode = "+".join(mode_parts) if mode_parts else "dry-run"

    write_report(mode, all_delete_candidates, all_missing_from_code, all_changes)

    print(f"Mode: {mode}")
    print(f"Checklist task ids: {len(checklist_by_id)}")
    for file_label, ids in all_delete_candidates.items():
        print(f"{file_label}: tasks to delete = {len(ids)}")
        if ids:
            print("  " + ", ".join(ids[:50]))
            if len(ids) > 50:
                print(f"  ...and {len(ids) - 50} more")
    print(f"Field differences found: {len(all_changes)}")
    print(f"Report written to: {OUTPUT_PATH}")

    if not (args.apply_delete or args.apply_align):
        print("\nDry run only. No campusData files were modified.")
        print("To delete tasks not in checklist:")
        print("  python tools/check_task_alignment.py --apply-delete")
        print("To update matching tasks to checklist values:")
        print("  python tools/check_task_alignment.py --apply-align")
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
