"""
Generate Pie Lab brand imagery aligned with the Ingredients palette.

Outputs:
  assets/og-image.jpg           (1200x630, Charcoal Oven bg, Fraunces italic)
  assets/logos/logo-stacked-light.png   (1024x1024 transparent, dark wordmark for light bg)
  assets/logos/logo-stacked-dark.png    (1024x1024 transparent, cream wordmark for dark bg)
  assets/logos/logo-horizontal-light.png (1200x400 transparent, dark wordmark)

Palette (Ingredients):
  Charcoal Oven #1F2428
  Cream Flour   #F7F3EC
  Paprika       #D8572C
"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FONTS = Path(r"C:\Users\scott\AppData\Local\Temp\fonts")

FRAUNCES_ITALIC = str(FONTS / "Fraunces-Italic.ttf")
FRAUNCES = str(FONTS / "Fraunces.ttf")
SPACE_MONO = str(FONTS / "SpaceMono.ttf")

CHARCOAL = (0x1F, 0x24, 0x28)
CREAM = (0xF7, 0xF3, 0xEC)
PAPRIKA = (0xD8, 0x57, 0x2C)


def kerned_text_width(draw, text, font, tracking=0):
    """Return total pixel width of `text` drawn with `tracking` px between chars."""
    if not text:
        return 0
    widths = [draw.textlength(c, font=font) for c in text]
    return int(sum(widths) + tracking * (len(text) - 1))


def draw_tracked_text(draw, xy, text, font, fill, tracking=0):
    """Draw text with extra pixel tracking between characters."""
    x, y = xy
    for c in text:
        draw.text((x, y), c, font=font, fill=fill)
        x += draw.textlength(c, font=font) + tracking


def generate_og_image():
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), CHARCOAL)
    draw = ImageDraw.Draw(img)

    # Corner accent marks (small paprika dots)
    inset = 40
    mark_r = 6
    for cx, cy in [(inset, inset), (W - inset, inset), (inset, H - inset), (W - inset, H - inset)]:
        draw.ellipse([cx - mark_r, cy - mark_r, cx + mark_r, cy + mark_r], fill=PAPRIKA)

    # Thin paprika rule lines connecting corners
    rule_y_top = inset
    rule_y_bot = H - inset
    draw.line([(inset + mark_r + 4, rule_y_top), (W - inset - mark_r - 4, rule_y_top)], fill=PAPRIKA, width=1)
    draw.line([(inset + mark_r + 4, rule_y_bot), (W - inset - mark_r - 4, rule_y_bot)], fill=PAPRIKA, width=1)

    # Eyebrow (mono, small, paprika)
    eyebrow_font = ImageFont.truetype(SPACE_MONO, 18)
    eyebrow = "PIZZA \u00b7 DOUGH \u00b7 SCIENCE"
    tracking = 6
    eyebrow_w = kerned_text_width(draw, eyebrow, eyebrow_font, tracking)
    eyebrow_y = 175
    draw_tracked_text(draw, ((W - eyebrow_w) // 2, eyebrow_y), eyebrow, eyebrow_font, PAPRIKA, tracking)

    # Wordmark "The Pie Lab" in Fraunces italic, centered
    wordmark_font = ImageFont.truetype(FRAUNCES_ITALIC, 148)
    the_pie = "The Pie "
    lab = "Lab"
    the_pie_w = draw.textlength(the_pie, font=wordmark_font)
    lab_w = draw.textlength(lab, font=wordmark_font)
    total_w = the_pie_w + lab_w
    start_x = (W - total_w) // 2
    wordmark_y = 240
    draw.text((start_x, wordmark_y), the_pie, font=wordmark_font, fill=CREAM)
    draw.text((start_x + the_pie_w, wordmark_y), lab, font=wordmark_font, fill=PAPRIKA)

    # Small divider below wordmark
    div_y = 430
    div_w = 80
    draw.line([((W - div_w) // 2, div_y), ((W + div_w) // 2, div_y)], fill=PAPRIKA, width=1)

    # Tagline (mono, uppercase, cream)
    tag_font = ImageFont.truetype(SPACE_MONO, 20)
    tagline = "THE SERIOUS HOME PIZZA MAKER'S TOOLKIT"
    tag_tracking = 3
    tag_w = kerned_text_width(draw, tagline, tag_font, tag_tracking)
    draw_tracked_text(draw, ((W - tag_w) // 2, div_y + 24), tagline, tag_font, CREAM, tag_tracking)

    # Domain at bottom (small, paprika)
    domain_font = ImageFont.truetype(SPACE_MONO, 18)
    domain = "pielab.app"
    domain_w = draw.textlength(domain, font=domain_font)
    draw.text(((W - domain_w) // 2, H - inset - 36), domain, font=domain_font, fill=PAPRIKA)

    out = ROOT / "assets" / "og-image.jpg"
    img.save(out, "JPEG", quality=92, optimize=True)
    print(f"Wrote {out} ({out.stat().st_size // 1024} KB)")


def generate_stacked_logo(fill_primary, fill_accent, out_name):
    """Square stacked logo on transparent background."""
    S = 1024
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # "The" small, tracked, mono
    the_font = ImageFont.truetype(SPACE_MONO, 44)
    the = "THE"
    the_tracking = 18
    the_w = kerned_text_width(draw, the, the_font, the_tracking)
    the_y = S // 2 - 170
    draw_tracked_text(draw, ((S - the_w) // 2, the_y), the, the_font, fill_primary, the_tracking)

    # Rule lines flanking "The"
    rule_len = 120
    rule_pad = 28
    rule_y = the_y + 28
    left_rule_end = (S - the_w) // 2 - rule_pad
    draw.line([(left_rule_end - rule_len, rule_y), (left_rule_end, rule_y)], fill=fill_primary, width=2)
    right_rule_start = (S + the_w) // 2 + rule_pad
    draw.line([(right_rule_start, rule_y), (right_rule_start + rule_len, rule_y)], fill=fill_primary, width=2)

    # "Pie Lab" in Fraunces italic, centered
    word_font = ImageFont.truetype(FRAUNCES_ITALIC, 260)
    pie = "Pie "
    lab = "Lab"
    pie_w = draw.textlength(pie, font=word_font)
    lab_w = draw.textlength(lab, font=word_font)
    total_w = pie_w + lab_w
    start_x = (S - total_w) // 2
    word_y = S // 2 - 80
    draw.text((start_x, word_y), pie, font=word_font, fill=fill_primary)
    draw.text((start_x + pie_w, word_y), lab, font=word_font, fill=fill_accent)

    out = ROOT / "assets" / "logos" / out_name
    img.save(out, "PNG", optimize=True)
    print(f"Wrote {out} ({out.stat().st_size // 1024} KB)")


def generate_horizontal_logo(fill_primary, fill_accent, out_name):
    W, H = 1200, 400
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Eyebrow "THE" above the wordmark
    the_font = ImageFont.truetype(SPACE_MONO, 34)
    the = "THE"
    the_tracking = 14
    the_w = kerned_text_width(draw, the, the_font, the_tracking)
    the_y = 80
    draw_tracked_text(draw, ((W - the_w) // 2, the_y), the, the_font, fill_primary, the_tracking)

    # Wordmark
    word_font = ImageFont.truetype(FRAUNCES_ITALIC, 200)
    pie = "Pie "
    lab = "Lab"
    pie_w = draw.textlength(pie, font=word_font)
    lab_w = draw.textlength(lab, font=word_font)
    total_w = pie_w + lab_w
    start_x = (W - total_w) // 2
    word_y = 140
    draw.text((start_x, word_y), pie, font=word_font, fill=fill_primary)
    draw.text((start_x + pie_w, word_y), lab, font=word_font, fill=fill_accent)

    out = ROOT / "assets" / "logos" / out_name
    img.save(out, "PNG", optimize=True)
    print(f"Wrote {out} ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    generate_og_image()
    generate_stacked_logo(CHARCOAL, PAPRIKA, "logo-stacked-light.png")
    generate_stacked_logo(CREAM, PAPRIKA, "logo-stacked-dark.png")
    generate_horizontal_logo(CHARCOAL, PAPRIKA, "logo-horizontal-light.png")
    generate_horizontal_logo(CREAM, PAPRIKA, "logo-horizontal-dark.png")
