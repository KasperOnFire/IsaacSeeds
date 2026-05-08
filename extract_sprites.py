"""
Extracts individual character portrait sprites from Isaac's charactermenu.png sprite sheets.
Uses exact pixel coordinates parsed from characterportraits.anm2 / characterportraitsalt.anm2.
Saves to frontend/static/sprites/ named to match character IDs in characters.ts.
"""

from PIL import Image
import os

GAME_PATH = r"C:\Program Files (x86)\Steam\steamapps\common\The Binding of Isaac Rebirth"
MOD_PATH = os.path.join(GAME_PATH, r"mods\better character menu_835236871\resources\gfx\ui\main menu")
OUT_DIR = os.path.join(os.path.dirname(__file__), r"frontend\static\sprites")

os.makedirs(OUT_DIR, exist_ok=True)

# Exact (x, y) crop coordinates from characterportraits.anm2 (Frame 1 of each animation).
# All portraits are 48x48 pixels.
BASE_COORDS = {
    "isaac":         (176, 288),
    "magdalene":     (176, 336),
    "cain":          (272, 288),
    "judas":         (272, 336),
    "blue_baby":     (368, 288),
    "eve":           (368, 336),
    "samson":        (176, 384),
    "azazel":        (272, 384),
    "lazarus":       (368, 384),
    "eden":          (176, 432),
    "the_lost":      (416, 288),
    "lilith":        (320, 432),
    "keeper":        (368, 432),
    "apollyon":      (384, 928),
    "the_forgotten": (336, 928),
    "bethany":       (464, 336),
    "jacob_and_esau":(464, 432),
}

# Exact (x, y) crop coordinates from characterportraitsalt.anm2 (Frame 1).
# Same coordinates but from charactermenualt.png.
TAINTED_COORDS = {
    "tainted_isaac":         (176, 288),
    "tainted_magdalene":     (176, 336),
    "tainted_cain":          (272, 288),
    "tainted_judas":         (272, 336),
    "tainted_blue_baby":     (368, 288),
    "tainted_eve":           (368, 336),
    "tainted_samson":        (176, 384),
    "tainted_azazel":        (272, 384),
    "tainted_lazarus":       (368, 384),
    "tainted_eden":          (176, 432),
    "tainted_lost":          (416, 288),
    "tainted_lilith":        (320, 432),
    "tainted_keeper":        (368, 432),
    "tainted_apollyon":      (384, 928),
    "tainted_forgotten":     (336, 928),
    "tainted_bethany":       (464, 336),
    "tainted_jacob":         (464, 432),
}

CELL = 48  # All portraits are 48x48 pixels
SCALE = 3  # Scale up 3x for crisp pixel art in the browser


def extract_portraits(sheet_path: str, coords: dict[str, tuple[int, int]], out_dir: str):
    img = Image.open(sheet_path).convert("RGBA")
    w, h = img.size
    print(f"\nSheet: {os.path.basename(sheet_path)} ({w}x{h})")

    for char_id, (x, y) in coords.items():
        if x + CELL > w or y + CELL > h:
            print(f"  SKIP {char_id} -- out of bounds at ({x},{y})")
            continue

        crop = img.crop((x, y, x + CELL, y + CELL))

        non_transparent = sum(1 for px in crop.getdata() if px[3] > 30)
        if non_transparent < 20:
            print(f"  EMPTY {char_id} at ({x},{y})")
            continue

        scaled = crop.resize((CELL * SCALE, CELL * SCALE), Image.NEAREST)
        out_path = os.path.join(out_dir, f"{char_id}.png")
        scaled.save(out_path, "PNG")
        print(f"  OK {char_id} at ({x},{y})")


if __name__ == "__main__":
    base_sheet    = os.path.join(MOD_PATH, "charactermenu.png")
    tainted_sheet = os.path.join(MOD_PATH, "charactermenualt.png")

    print("-- Extracting base characters --")
    extract_portraits(base_sheet, BASE_COORDS, OUT_DIR)

    print("\n-- Extracting tainted characters --")
    extract_portraits(tainted_sheet, TAINTED_COORDS, OUT_DIR)

    print(f"\nDone. {len(BASE_COORDS) + len(TAINTED_COORDS)} sprites saved to: {OUT_DIR}")
