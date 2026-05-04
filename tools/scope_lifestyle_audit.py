#!/usr/bin/env python3
"""
Read-only scan for daily-life / non-administrative keywords.

Run:
  python tools/scope_lifestyle_audit.py

Output:
  data/lifestyle_scope_audit_report.md

This does NOT modify any file.
"""

from __future__ import annotations
from pathlib import Path
import re

DATA_FILES = [
    Path("client/src/data/campusData.ts"),
    Path("shared/campusData.ts"),
]

KEYWORDS = [
    "YouBike", "公車", "計程車", "民雄", "交通", "洗衣", "洗衣機", "床墊",
    "颱風假", "國定假日", "社團", "體育", "健身房", "體育館", "列印",
    "兼職", "實習", "教授溝通", "寫郵件給教授", "不收國際生"
]

OUTPUT_PATH = Path("data/lifestyle_scope_audit_report.md")

def main() -> int:
    lines = ["# Lifestyle Scope Audit Report", ""]
    total = 0

    for path in DATA_FILES:
        if not path.exists():
            lines.append(f"## {path}")
            lines.append("- Missing file")
            continue

        text = path.read_text(encoding="utf-8")
        lines.append(f"## {path}")
        found_any = False

        for kw in KEYWORDS:
            matches = list(re.finditer(re.escape(kw), text))
            if not matches:
                continue

            found_any = True
            total += len(matches)
            lines.append(f"### `{kw}` — {len(matches)} match(es)")

            for m in matches[:10]:
                start = max(0, m.start() - 120)
                end = min(len(text), m.end() + 120)
                snippet = text[start:end].replace("\n", " ")
                lines.append(f"- ...{snippet}...")
            if len(matches) > 10:
                lines.append(f"- ...and {len(matches) - 10} more")
            lines.append("")

        if not found_any:
            lines.append("- No lifestyle keywords found.")
        lines.append("")

    lines.append(f"Total matches: {total}")
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"Report written to: {OUTPUT_PATH}")
    print(f"Total matches: {total}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
