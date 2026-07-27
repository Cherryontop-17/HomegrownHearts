"""
Font glyph-coverage gate.

Task 1.3's acceptance criterion is that the subset covers Spanish — otherwise
accented text falls back to a system serif and flashes on every page load.

Rather than trusting the declared `unicode-range`, this reads the actual `cmap`
out of each shipped .woff2 and checks it against every character that really
appears in the site's copy: the whole EN + ES UI dictionary, plus the org facts
in config.ts, plus the Spanish letters and punctuation the content collections
will introduce later.

Run: `python scripts/check-font-coverage.py`
Requires: fontTools (`pip install fonttools brotli`)
"""

import re
import sys
import unicodedata
from pathlib import Path

try:
    from fontTools.ttLib import TTFont
except ImportError:
    sys.exit("fontTools not installed. Run: pip install fonttools brotli")

ROOT = Path(__file__).resolve().parent.parent

FONTS = [
    ("Fraunces (display)", ROOT / "public/fonts/fraunces-latin-wght-normal.woff2"),
    ("Inter (body)", ROOT / "public/fonts/inter-latin-wght-normal.woff2"),
]

# Files whose string literals must render. These are the ones that exist today;
# `src/content/{en,es}` joins them at task 3.9.
COPY_SOURCES = [
    ROOT / "src/i18n/ui.ts",
    ROOT / "src/config.ts",
]

# Spanish orthography in full, plus the typographic punctuation the style guide
# uses. Listed explicitly so coverage does not depend on which strings happen to
# be written yet.
REQUIRED = set(
    "abcdefghijklmnopqrstuvwxyz"
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "0123456789"
    "áéíóúüñÁÉÍÓÚÜÑ"     # Spanish diacritics — Latin-1 Supplement
    "¿¡«»"                # Spanish punctuation
    ".,;:!?'\"()[]{}@#%&*+-=/\\|<>~^_$"
    "—–…“”‘’·°º ª€"       # typographic set used in copy
)


def chars_in_source(path: Path) -> set:
    """Every character inside single/double-quoted literals in a TS file."""
    if not path.exists():
        return set()
    text = path.read_text(encoding="utf-8")
    found = set()
    for match in re.findall(r"'([^'\\\n]*)'|\"([^\"\\\n]*)\"", text):
        for group in match:
            found.update(group)
    return found


def codepoints(font_path: Path) -> set:
    font = TTFont(font_path)
    covered = set()
    for table in font["cmap"].tables:
        covered.update(table.cmap.keys())
    font.close()
    return covered


def describe(ch: str) -> str:
    try:
        name = unicodedata.name(ch)
    except ValueError:
        name = "unnamed"
    return f"U+{ord(ch):04X} {ch!r} ({name})"


def main() -> int:
    needed = set(REQUIRED)
    for src in COPY_SOURCES:
        needed |= chars_in_source(src)

    # Control characters and plain space are not glyphs worth gating on.
    needed = {c for c in needed if ord(c) > 32}

    failures = 0
    for label, path in FONTS:
        if not path.exists():
            print(f"  MISSING  {label}: {path.relative_to(ROOT)}")
            print("           Run `npm run sync:fonts` first.")
            failures += 1
            continue

        covered = codepoints(path)
        missing = sorted(c for c in needed if ord(c) not in covered)

        size_kb = path.stat().st_size / 1024
        if missing:
            failures += 1
            print(f"  FAIL  {label}  ({size_kb:.1f} KB) - {len(missing)} missing:")
            for ch in missing:
                print(f"          {describe(ch)}")
        else:
            print(f"  pass  {label}  ({size_kb:.1f} KB) - all {len(needed)} characters covered")

    print("")
    if failures:
        print(f"{failures} font(s) failed coverage. Spanish would fall back to a system face.")
        return 1
    print(f"Both faces cover every character in EN + ES copy ({len(needed)} distinct).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
