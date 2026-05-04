#!/usr/bin/env python3
"""
Normalize tracked campus image file extensions safely with git mv.

Run from the project root.

Preview only:
  python tools/normalize_image_extensions.py

Apply changes:
  python tools/normalize_image_extensions.py --apply

What it does:
- Uses `git ls-files client/public/images` so it only touches tracked image files.
- Renames JPEG extensions to .jpg:
    .JPG, .JPEG, .jpeg, .Jpeg, etc. -> .jpg
- Renames PNG extensions to .png:
    .PNG, .Png, etc. -> .png
- Uses two-step `git mv` for case-only renames so Windows + Git records the change.
- Also normalizes image extension strings in:
    client/src/data/campusData.ts
    shared/campusData.ts
"""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path


IMAGE_ROOT = Path("client/public/images")
DATA_FILES = [
    Path("client/src/data/campusData.ts"),
    Path("shared/campusData.ts"),
]

JPEG_SUFFIXES = {".jpg", ".jpeg"}
PNG_SUFFIXES = {".png"}


def run(cmd: list[str], *, check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, text=True, capture_output=True, check=check)


def git_root() -> Path:
    try:
        result = run(["git", "rev-parse", "--show-toplevel"])
    except subprocess.CalledProcessError as exc:
        print("ERROR: This script must be run inside a Git repository.")
        print(exc.stderr.strip())
        raise SystemExit(1)

    return Path(result.stdout.strip())


def git_ls_files(root: Path) -> list[Path]:
    try:
        result = run(["git", "ls-files", str(IMAGE_ROOT).replace("\\", "/")])
    except subprocess.CalledProcessError as exc:
        print("ERROR: Failed to list tracked image files.")
        print(exc.stderr.strip())
        raise SystemExit(1)

    return [root / line.strip() for line in result.stdout.splitlines() if line.strip()]


def normalized_path(path: Path) -> Path | None:
    suffix = path.suffix

    if suffix.lower() in JPEG_SUFFIXES and suffix != ".jpg":
        return path.with_suffix(".jpg")

    if suffix.lower() in PNG_SUFFIXES and suffix != ".png":
        return path.with_suffix(".png")

    return None


def ensure_unique_temp_path(path: Path) -> Path:
    temp = path.with_name(f"{path.stem}.__tmp_ext_normalize__{path.suffix}")
    counter = 1
    while temp.exists():
        temp = path.with_name(f"{path.stem}.__tmp_ext_normalize_{counter}__{path.suffix}")
        counter += 1
    return temp


def git_mv_case_safe(old_abs: Path, new_abs: Path, root: Path, apply: bool) -> None:
    old_rel = old_abs.relative_to(root).as_posix()
    new_rel = new_abs.relative_to(root).as_posix()

    if old_rel == new_rel:
        return

    # If target exists and is not the same file path, do not overwrite silently.
    if new_abs.exists() and old_abs.resolve() != new_abs.resolve():
        print(f"SKIP target exists: {old_rel} -> {new_rel}")
        return

    temp_abs = ensure_unique_temp_path(old_abs)
    temp_rel = temp_abs.relative_to(root).as_posix()

    print(f"RENAME {old_rel} -> {new_rel}")

    if not apply:
        return

    # Two-step git mv is required for case-only renames on Windows.
    run(["git", "mv", "-f", old_rel, temp_rel])
    run(["git", "mv", "-f", temp_rel, new_rel])


def normalize_data_file(path: Path, apply: bool) -> bool:
    if not path.exists():
        return False

    text = path.read_text(encoding="utf-8")
    updated = text

    # Keep this intentionally narrow: only image extension strings.
    replacements = {
        ".JPG": ".jpg",
        ".JPEG": ".jpg",
        ".Jpg": ".jpg",
        ".Jpeg": ".jpg",
        ".jpeg": ".jpg",
        ".PNG": ".png",
        ".Png": ".png",
    }

    for old, new in replacements.items():
        updated = updated.replace(old, new)

    if updated == text:
        return False

    print(f"UPDATE references in {path.as_posix()}")
    if apply:
        path.write_text(updated, encoding="utf-8")

    return True


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Actually perform git mv and update data references.")
    args = parser.parse_args()

    root = git_root()
    tracked_files = git_ls_files(root)

    candidates: list[tuple[Path, Path]] = []
    for file_abs in tracked_files:
        new_abs = normalized_path(file_abs)
        if new_abs is not None:
            candidates.append((file_abs, new_abs))

    mode = "APPLY" if args.apply else "DRY RUN"
    print(f"Mode: {mode}")
    print(f"Tracked files under {IMAGE_ROOT.as_posix()}: {len(tracked_files)}")
    print(f"Files needing extension normalization: {len(candidates)}")
    print("-" * 72)

    for old_abs, new_abs in candidates:
        git_mv_case_safe(old_abs, new_abs, root, args.apply)

    print("-" * 72)

    changed_reference_files = 0
    for rel_path in DATA_FILES:
        if normalize_data_file(root / rel_path, args.apply):
            changed_reference_files += 1

    if not candidates and changed_reference_files == 0:
        print("Nothing to change.")

    if not args.apply:
        print("\nDry run only. To apply these changes, run:")
        print("  python tools/normalize_image_extensions.py --apply")
    else:
        print("\nDone. Next recommended checks:")
        print("  git status")
        print("  git ls-files | Select-String -CaseSensitive \"\\.JPG|\\.JPEG|\\.PNG\"")
        print("  pnpm build")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
