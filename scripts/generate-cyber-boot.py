import os
import math
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# ── Configuration ─────────────────────────────────────────────────────────────
WIDTH, HEIGHT = 1080, 2400
FPS = 60
TOTAL_FRAMES = 60
OUTPUT_DIR = "/home/hasan/bootanimation-gallery/scratch/cyber_boot"
PART0_DIR = os.path.join(OUTPUT_DIR, "part0")

# Create directories
os.makedirs(PART0_DIR, exist_ok=True)

# Try loading custom monospace font from project, fallback to default
FONT_PATH = "/home/hasan/bootanimation-gallery/web/src/app/fonts/GeistMonoVF.woff"
try:
    font_large = ImageFont.truetype(FONT_PATH, 42)
    font_small = ImageFont.truetype(FONT_PATH, 32)
except Exception:
    font_large = ImageFont.load_default()
    font_small = ImageFont.load_default()

print("🤖 Generating 60 cybertech boot frames (1080x2400, 60fps)...")

for i in range(TOTAL_FRAMES):
    # Create black canvas
    img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 255))
    draw = ImageDraw.Draw(img)
    
    # ── 1. Tech Background Grid (Removed) ──────────────────────────────────────
    pass

    # ── 2. Rotating Outer HUD Ring ──────────────────────────────────────────────
    center_x, center_y = WIDTH // 2, HEIGHT // 2
    
    # Rotation angle based on frame index
    angle_offset_ccw = (i / TOTAL_FRAMES) * 360
    angle_offset_cw = -(i / TOTAL_FRAMES) * 360
    
    # Segments for outer ring (CCW)
    outer_r_in = 260
    outer_r_out = 275
    draw.arc(
        [center_x - outer_r_out, center_y - outer_r_out, center_x + outer_r_out, center_y + outer_r_out],
        start=angle_offset_ccw,
        end=angle_offset_ccw + 120,
        fill=(0, 223, 216, 180),  # Bright neon cyan
        width=4
    )
    draw.arc(
        [center_x - outer_r_out, center_y - outer_r_out, center_x + outer_r_out, center_y + outer_r_out],
        start=angle_offset_ccw + 180,
        end=angle_offset_ccw + 300,
        fill=(0, 223, 216, 180),
        width=4
    )

    # Segments for mid ring (CW)
    mid_r = 220
    draw.arc(
        [center_x - mid_r, center_y - mid_r, center_x + mid_r, center_y + mid_r],
        start=angle_offset_cw + 60,
        end=angle_offset_cw + 150,
        fill=(139, 92, 246, 140),  # Neon purple
        width=2
    )
    draw.arc(
        [center_x - mid_r, center_y - mid_r, center_x + mid_r, center_y + mid_r],
        start=angle_offset_cw + 240,
        end=angle_offset_cw + 330,
        fill=(139, 92, 246, 140),
        width=2
    )

    # ── 3. Pulsing Core with Blur Glow ─────────────────────────────────────────
    pulse = math.sin((i / TOTAL_FRAMES) * math.pi * 2)
    core_r = 130 + int(10 * pulse)
    
    # Create glow overlay
    glow_img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_img)
    
    # Draw glow ring on overlay
    glow_draw.ellipse(
        [center_x - core_r - 10, center_y - core_r - 10, center_x + core_r + 10, center_y + core_r + 10],
        outline=(0, 223, 216, 120),
        width=15
    )
    # Apply Gaussian blur to overlay
    glow_blur = glow_img.filter(ImageFilter.GaussianBlur(15))
    # Alpha composite the glow onto main image
    img = Image.alpha_composite(img, glow_blur)
    draw = ImageDraw.Draw(img)  # Re-acquire draw context

    # Draw solid core ring
    draw.ellipse(
        [center_x - core_r, center_y - core_r, center_x + core_r, center_y + core_r],
        outline=(0, 223, 216, 255),
        width=5
    )

    # ── 4. Crosshairs & Ticks ──────────────────────────────────────────────────
    draw.line([(center_x - 30, center_y), (center_x + 30, center_y)], fill=(0, 223, 216, 100), width=1)
    draw.line([(center_x, center_y - 30), (center_x, center_y + 30)], fill=(0, 223, 216, 100), width=1)
    
    # Draw decorative outer bracket angles
    bracket_offset = 320
    bracket_size = 40
    # Top Left Bracket
    draw.line([(center_x - bracket_offset, center_y - bracket_offset), (center_x - bracket_offset + bracket_size, center_y - bracket_offset)], fill=(0, 223, 216, 200), width=2)
    draw.line([(center_x - bracket_offset, center_y - bracket_offset), (center_x - bracket_offset, center_y - bracket_offset + bracket_size)], fill=(0, 223, 216, 200), width=2)
    # Top Right Bracket
    draw.line([(center_x + bracket_offset, center_y - bracket_offset), (center_x + bracket_offset - bracket_size, center_y - bracket_offset)], fill=(0, 223, 216, 200), width=2)
    draw.line([(center_x + bracket_offset, center_y - bracket_offset), (center_x + bracket_offset, center_y - bracket_offset + bracket_size)], fill=(0, 223, 216, 200), width=2)
    # Bottom Left Bracket
    draw.line([(center_x - bracket_offset, center_y + bracket_offset), (center_x - bracket_offset + bracket_size, center_y + bracket_offset)], fill=(0, 223, 216, 200), width=2)
    draw.line([(center_x - bracket_offset, center_y + bracket_offset), (center_x - bracket_offset, center_y + bracket_offset - bracket_size)], fill=(0, 223, 216, 200), width=2)
    # Bottom Right Bracket
    draw.line([(center_x + bracket_offset, center_y + bracket_offset), (center_x + bracket_offset - bracket_size, center_y + bracket_offset)], fill=(0, 223, 216, 200), width=2)
    draw.line([(center_x + bracket_offset, center_y + bracket_offset), (center_x + bracket_offset, center_y + bracket_offset - bracket_size)], fill=(0, 223, 216, 200), width=2)

    # ── 5. Terminal Tech Readouts ──────────────────────────────────────────────
    progress_val = int((i / (TOTAL_FRAMES - 1)) * 100)
    
    # Header Info (Removed as requested)
    pass
    
    # Parameter Status block
    statuses = [
        ("SYS_MODULES", "ACTIVE"),
        ("DECRYPT_CORE", "SECURE"),
        ("MEM_DYN_CHK", "SUCCESS"),
        ("ENG_LINKED", "WASM_60")
    ]
    
    # Display parameter readouts (centered)
    text_y_start = center_y + 440
    for idx, (label, val) in enumerate(statuses):
        y_pos = text_y_start + (idx * 50)
        label_part = f"{label} :: "
        label_w = draw.textlength(label_part, font=font_small)
        val_w = draw.textlength(val, font=font_small)
        total_w = label_w + val_w
        start_x = center_x - int(total_w // 2)
        draw.text((start_x, y_pos), label_part, fill=(100, 110, 120, 255), font=font_small)
        draw.text((start_x + int(label_w), y_pos), val, fill=(0, 223, 216, 255), font=font_small)

    bar_width_chars = 20
    filled_chars = int((i / (TOTAL_FRAMES - 1)) * bar_width_chars)
    progress_bar = "[" + "=" * filled_chars + " " * (bar_width_chars - filled_chars) + "]"

    loading_text = f"LOADING: {progress_val}%"
    text_w = draw.textlength(loading_text, font=font_large)
    draw.text((center_x - int(text_w // 2), text_y_start + 240), loading_text, fill=(0, 223, 216, 255), font=font_large)
    
    bar_w = draw.textlength(progress_bar, font=font_large)
    draw.text((center_x - int(bar_w // 2), text_y_start + 300), progress_bar, fill=(139, 92, 246, 255), font=font_large)

    # Save frame
    frame_path = os.path.join(PART0_DIR, f"frame_{i:03d}.png")
    # Convert RGBA to RGB for saving space & standard compatibility
    final_img = img.convert("RGB")
    final_img.save(frame_path, "PNG")
    
    # Progress printing
    sys.stdout.write(f"\r  └─ Generated frame {i+1}/{TOTAL_FRAMES}")
    sys.stdout.flush()

print("\n⚙️ Creating desc.txt...")
desc_content = f"{WIDTH} {HEIGHT} {FPS}\np 0 0 part0\n"
with open(os.path.join(OUTPUT_DIR, "desc.txt"), "w") as f:
    f.write(desc_content)

print("🎉 Generation complete! Script folder built at /home/hasan/bootanimation-gallery/scratch/cyber_boot/")
