#!/usr/bin/env python3
"""
Apply manual coordinate flags to CCU campusData files.

Run from project root:
  python tools/apply_manual_coordinate_flags.py

This script updates:
  - client/src/data/campusData.ts
  - shared/campusData.ts

It adds:
  use_manual_coordinates?: boolean;

to Office and Department interfaces, then marks manually corrected locations with:
  "use_manual_coordinates": true

Matching is done by id first, and by exact latitude/longitude as a fallback.
"""

from __future__ import annotations

from pathlib import Path
import re
import sys
from typing import Dict, List, Tuple


DATA_FILES = [
    Path("client/src/data/campusData.ts"),
    Path("shared/campusData.ts"),
]

MANUAL_IDS = {
    # Administrative offices
    "it_center",
    "language_center",
    "vehicle_control",
    "osa_extracurricular",
    "health_center",
    "counseling",

    # Management
    "information_management",
    "college_management_office",
    "fintech_master",
    "imf",

    # Possible IDs for 高階主管管理碩士在職專班
    "emba",
    "executive_mba",
    "executive_master",
    "executive_management",
    "ait_excellence",

    # Humanities
    "east_asian_classics",
    "chinese_lit",
    "taiwan_lit",
    "college_humanities_office",
    "linguistics",

    # Social sciences
    "criminology",
    "isia",
    "college_social_sciences_office",
    "cogsci",

    # Science
    "college_science_office",
    "stemphd",
    "interdisciplinary_science_phd",
    "interdisciplinary_sciences_phd",

    # Education
    "graduate_education",
    "education",
    "college_education_office",
    "adult_continuing_education",
    "teacher_education",
    "educational_gerontology",

    # Engineering
    "ome",
    "aimhi",
    "comm_eng",
    "csie_sponsored_research",
    "csie_digital_learning",
    "telecom_research",
}

# Coordinate fallback covers unknown / renamed ids.
MANUAL_COORDINATES: Dict[str, Tuple[float, float]] = {
    "資訊處": (23.562975606356652, 120.47430524970238),
    "語言中心": (23.563286792578907, 120.4745612917533),
    "資訊管理學系": (23.560367767930487, 120.47626657838507),
    "管理學院院辦": (23.56060697202456, 120.47638643431472),
    "金融科技碩士學位學程": (23.560524089020632, 120.47631849317845),
    "高階主管管理碩士在職專班": (23.560682669630367, 120.4759107974078),
    "國際財務金融管理碩士學位學程": (23.560555308369434, 120.47634898591488),
    "東亞漢籍與儒學研究中心": (23.561042363535513, 120.47338476061616),
    "中文系": (23.561153000753983, 120.47345181584159),
    "台灣文學與創意應用研究所": (23.56137285015513, 120.47375920015418),
    "文學院院辦": (23.561247279486604, 120.4732939520733),
    "犯罪防治學系": (23.563618885097508, 120.47629018602217),
    "駐警隊－車輛管控中心": (23.56081435782497, 120.4720087501023),
    "學務處－課外活動組": (23.560752987369337, 120.47202118452867),
    "衛生保健組": (23.560441021587568, 120.4726606164853),
    "諮商中心": (23.560413111112986, 120.47264482826567),
    "戰略暨國際事務研究所": (23.56419828108415, 120.47697052841933),
    "社會科學院院辦": (23.56064464374194, 120.47401539035829),
    "認知科學博士學位學程": (23.560721193031082, 120.47410889679124),
    "語言學研究所": (23.561301450417588, 120.4736666448795),
    "理學院院辦": (23.564103909894776, 120.47579618506781),
    "跨領域科學國際博士學位學程": (23.564187619936725, 120.47594290811958),
    "教育學研究所": (23.563065536234426, 120.47686540424797),
    "教育學院院辦": (23.563316978200866, 120.47666604787),
    "成人及繼續教育學系": (23.562982209430057, 120.47696906956452),
    "師資培育中心": (23.56328627891681, 120.47683510207852),
    "高齡教育研究中心": (23.563333058775378, 120.47681117931316),
    "光機電整合工程研究所": (23.561652393890682, 120.4792521239477),
    "前瞻製造系統頂尖研究中心": (23.561986762313772, 120.47917702209521),
    "通訊工程學系": (23.562028558306825, 120.47920384418542),
    "資訊工程學系建教合作中心": (23.561819578208585, 120.4791716576772),
    "資訊工程學系數位學習科技研究中心": (23.562013847150183, 120.4792198929258),
    "電信研究中心": (23.562021222913106, 120.47933791012258),
}


def add_interface_field(text: str, interface_name: str) -> str:
    pattern = re.compile(rf"(export interface {interface_name} \{{[\s\S]*?\n\}})", re.M)

    def repl(match: re.Match[str]) -> str:
        block = match.group(1)
        if "use_manual_coordinates?: boolean;" in block:
            return block

        # Prefer adding near coordinate fields.
        anchor = "  longitude: number;\n"
        if anchor in block:
            return block.replace(anchor, anchor + "  use_manual_coordinates?: boolean;\n", 1)

        # Fallback before closing brace.
        return block.replace("\n}", "\n  use_manual_coordinates?: boolean;\n}", 1)

    return pattern.sub(repl, text, count=1)


def iter_object_blocks(text: str) -> List[Tuple[int, int]]:
    """Return start/end indices for object literals that contain an id field."""
    blocks: List[Tuple[int, int]] = []
    n = len(text)
    i = 0
    while i < n:
        if text[i] != "{":
            i += 1
            continue

        start = i
        depth = 0
        in_string = False
        escape = False
        j = i

        while j < n:
            ch = text[j]

            if in_string:
                if escape:
                    escape = False
                elif ch == "\\":
                    escape = True
                elif ch == '"':
                    in_string = False
            else:
                if ch == '"':
                    in_string = True
                elif ch == "{":
                    depth += 1
                elif ch == "}":
                    depth -= 1
                    if depth == 0:
                        end = j + 1
                        block = text[start:end]
                        if re.search(r'"id"\s*:\s*"[^"]+"', block):
                            blocks.append((start, end))
                        i = end
                        break
            j += 1
        else:
            i += 1

    return blocks


def parse_id(block: str) -> str | None:
    m = re.search(r'"id"\s*:\s*"([^"]+)"', block)
    return m.group(1) if m else None


def parse_lat_lng(block: str) -> Tuple[float | None, float | None]:
    lat_m = re.search(r'"latitude"\s*:\s*(-?\d+(?:\.\d+)?)', block)
    lng_m = re.search(r'"longitude"\s*:\s*(-?\d+(?:\.\d+)?)', block)
    return (
        float(lat_m.group(1)) if lat_m else None,
        float(lng_m.group(1)) if lng_m else None,
    )


def coordinate_matches(lat: float | None, lng: float | None) -> bool:
    if lat is None or lng is None:
        return False

    for _, (target_lat, target_lng) in MANUAL_COORDINATES.items():
        if abs(lat - target_lat) < 1e-12 and abs(lng - target_lng) < 1e-12:
            return True

    return False


def should_mark(block: str) -> bool:
    item_id = parse_id(block)
    if item_id in MANUAL_IDS:
        return True

    lat, lng = parse_lat_lng(block)
    return coordinate_matches(lat, lng)


def add_manual_flag_to_block(block: str) -> str:
    if re.search(r'"use_manual_coordinates"\s*:', block):
        return block

    lines = block.splitlines()
    if len(lines) < 2:
        return block

    # Add comma to last property line if needed.
    closing_index = len(lines) - 1
    last_prop_index = closing_index - 1

    while last_prop_index > 0 and not lines[last_prop_index].strip():
        last_prop_index -= 1

    if not lines[last_prop_index].rstrip().endswith(","):
        lines[last_prop_index] = lines[last_prop_index].rstrip() + ","

    indent_match = re.match(r"(\s*)", lines[last_prop_index])
    indent = indent_match.group(1) if indent_match else "    "
    lines.insert(closing_index, f'{indent}"use_manual_coordinates": true')
    return "\n".join(lines)


def update_text(text: str) -> Tuple[str, List[str]]:
    text = add_interface_field(text, "Office")
    text = add_interface_field(text, "Department")

    blocks = iter_object_blocks(text)
    replacements: List[Tuple[int, int, str]] = []
    marked_ids: List[str] = []

    for start, end in blocks:
        block = text[start:end]
        if should_mark(block):
            new_block = add_manual_flag_to_block(block)
            if new_block != block:
                replacements.append((start, end, new_block))
                marked_ids.append(parse_id(block) or "<unknown>")

    for start, end, new_block in reversed(replacements):
        text = text[:start] + new_block + text[end:]

    return text, marked_ids


def main() -> int:
    project_root = Path.cwd()
    failed = False

    for rel_path in DATA_FILES:
        path = project_root / rel_path
        if not path.exists():
            print(f"ERROR: missing file: {rel_path}")
            failed = True
            continue

        original = path.read_text(encoding="utf-8")
        updated, marked_ids = update_text(original)

        if updated == original:
            print(f"{rel_path}: no changes needed")
        else:
            path.write_text(updated, encoding="utf-8")
            print(f"{rel_path}: updated")
            print(f"  newly marked ids: {', '.join(marked_ids) if marked_ids else '(interface only)'}")

    if failed:
        return 1

    print("\nNext steps:")
    print("  pnpm build")
    print("  git diff -- client/src/data/campusData.ts shared/campusData.ts")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
