import os
import math
import sys
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# ── Setup ─────────────────────────────────────────────────────────────────────
WIDTH, HEIGHT = 1080, 2400
FPS = 60
TOTAL_FRAMES = 60
OUTPUT_BASE_DIR = "/home/hasan/bootanimation-gallery/scratch/gallery"

# Ensure fonts
FONT_PATH = "/home/hasan/bootanimation-gallery/web/src/app/fonts/GeistMonoVF.woff"
try:
    font_large = ImageFont.truetype(FONT_PATH, 48)
    font_medium = ImageFont.truetype(FONT_PATH, 36)
    font_small = ImageFont.truetype(FONT_PATH, 24)
except Exception:
    font_large = ImageFont.load_default()
    font_medium = ImageFont.load_default()
    font_small = ImageFont.load_default()

center_x, center_y = WIDTH // 2, HEIGHT // 2

# Helper to save desc.txt
def save_desc(anim_dir):
    desc_content = f"{WIDTH} {HEIGHT} {FPS}\np 0 0 part0\n"
    with open(os.path.join(anim_dir, "desc.txt"), "w") as f:
        f.write(desc_content)

# ── 1. Ronaldo Siu Wireframe ──────────────────────────────────────────────────
def render_ronaldo_siu():
    anim_dir = os.path.join(OUTPUT_BASE_DIR, "ronaldo_siu")
    part0_dir = os.path.join(anim_dir, "part0")
    os.makedirs(part0_dir, exist_ok=True)
    
    print("⚽ Rendering Ronaldo Siu Jump & Shockwave...")
    for i in range(TOTAL_FRAMES):
        img = Image.new("RGB", (WIDTH, HEIGHT), (0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Physics offset for jump
        # Frames 0-30: Jumps up and lands. Frames 30-60: Standing & arms slide to SIU
        t = i / 30.0
        y_offset = 0
        if t < 1.0:
            y_offset = -280 * math.sin(t * math.pi)  # parabolic jump
        
        # Ground indicator line
        ground_y = 1700
        draw.line([(center_x - 300, ground_y), (center_x + 300, ground_y)], fill=(30, 40, 50), width=3)
        
        # Ronaldo Joint Coordinates
        head = (center_x, center_y - 200 + y_offset)
        neck = (center_x, center_y - 140 + y_offset)
        hip = (center_x, center_y + 100 + y_offset)
        
        # Arms spread back pose
        if t < 1.0: # Jumping
            l_shoulder = (center_x - 40, center_y - 120 + y_offset)
            l_elbow = (center_x - 140, center_y - 160 + y_offset)
            l_hand = (center_x - 220, center_y - 80 + y_offset)
            
            r_shoulder = (center_x + 40, center_y - 120 + y_offset)
            r_elbow = (center_x + 140, center_y - 160 + y_offset)
            r_hand = (center_x + 220, center_y - 80 + y_offset)
            
            # Bent legs in air
            l_knee = (center_x - 80, center_y + 220 + y_offset)
            l_foot = (center_x - 50, center_y + 360 + y_offset)
            r_knee = (center_x + 80, center_y + 220 + y_offset)
            r_foot = (center_x + 50, center_y + 360 + y_offset)
        else: # Landing shockwave and final pose
            l_shoulder = (center_x - 40, center_y - 120)
            l_elbow = (center_x - 120, center_y - 20)
            l_hand = (center_x - 180, center_y + 80)
            
            r_shoulder = (center_x + 40, center_y - 120)
            r_elbow = (center_x + 120, center_y - 20)
            r_hand = (center_x + 180, center_y + 80)
            
            # Legs planted
            l_knee = (center_x - 100, center_y + 240)
            l_foot = (center_x - 150, ground_y)
            r_knee = (center_x + 100, center_y + 240)
            r_foot = (center_x + 150, ground_y)
            
            # Expanding shockwave at ground (cyan neon rings)
            wave_age = (i - 30) / 30.0
            if wave_age > 0:
                wave_r = int(500 * wave_age)
                alpha = int(255 * (1 - wave_age))
                draw.ellipse(
                    [center_x - wave_r, ground_y - 30, center_x + wave_r, ground_y + 30],
                    outline=(0, 223, 216, alpha), width=3
                )
        
        # Draw skeleton wireframe
        draw.ellipse([head[0]-35, head[1]-35, head[0]+35, head[1]+35], outline=(0, 223, 216), width=4)
        draw.line([neck, hip], fill=(0, 223, 216), width=8) # spine
        
        # Left Arm
        draw.line([neck, l_shoulder], fill=(0, 223, 216), width=6)
        draw.line([l_shoulder, l_elbow], fill=(0, 223, 216), width=5)
        draw.line([l_elbow, l_hand], fill=(0, 223, 216), width=4)
        
        # Right Arm
        draw.line([neck, r_shoulder], fill=(0, 223, 216), width=6)
        draw.line([r_shoulder, r_elbow], fill=(0, 223, 216), width=5)
        draw.line([r_elbow, r_hand], fill=(0, 223, 216), width=4)
        
        # Left Leg
        draw.line([hip, l_knee], fill=(0, 223, 216), width=8)
        draw.line([l_knee, l_foot], fill=(0, 223, 216), width=6)
        
        # Right Leg
        draw.line([hip, r_knee], fill=(0, 223, 216), width=8)
        draw.line([r_knee, r_foot], fill=(0, 223, 216), width=6)
        
        # Text SIUUU centered at bottom
        text = "S I U U U !" if i >= 30 else "CR7 // SIU_JUMP"
        text_w = draw.textlength(text, font=font_large)
        draw.text((center_x - text_w // 2, ground_y + 120), text, fill=(0, 223, 216), font=font_large)
        
        img.save(os.path.join(part0_dir, f"frame_{i:03d}.png"), "PNG")
    save_desc(anim_dir)

# ── 2. Avengers Portal ────────────────────────────────────────────────────────
def render_avengers():
    anim_dir = os.path.join(OUTPUT_BASE_DIR, "avengers_portal")
    part0_dir = os.path.join(anim_dir, "part0")
    os.makedirs(part0_dir, exist_ok=True)
    
    print("🛡️ Rendering Avengers Portal Pulse...")
    for i in range(TOTAL_FRAMES):
        img = Image.new("RGB", (WIDTH, HEIGHT), (0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Rotating portal sparks
        angle = (i / TOTAL_FRAMES) * 360
        r_portal = 300
        draw.ellipse([center_x - r_portal, center_y - r_portal, center_x + r_portal, center_y + r_portal], outline=(0, 100, 255, 100), width=2)
        
        # Pulsing neon glow for the Avengers logo
        pulse = math.sin((i / TOTAL_FRAMES) * math.pi * 2)
        glow_val = int(180 + 75 * pulse)
        color = (glow_val, 30, 30) # Red pulsing core
        
        # Avengers 'A' Logo Coords
        # Slant Left
        draw.polygon([(center_x - 140, center_y + 200), (center_x - 100, center_y + 200), (center_x + 20, center_y - 200), (center_x - 20, center_y - 200)], fill=color)
        # Slant Right
        draw.polygon([(center_x + 10, center_y - 200), (center_x + 50, center_y - 200), (center_x + 150, center_y + 200), (center_x + 110, center_y + 200)], fill=color)
        # Horizontal Bar with arrow tail extending right
        draw.polygon([(center_x - 80, center_y + 40), (center_x + 200, center_y + 40), (center_x + 200, center_y + 90), (center_x - 80, center_y + 90)], fill=color)
        # Arrowhead point
        draw.polygon([(center_x + 200, center_y + 20), (center_x + 260, center_y + 65), (center_x + 200, center_y + 110)], fill=color)
        
        # Dynamic circular HUD rings around logo
        draw.arc([center_x - 280, center_y - 280, center_x + 280, center_y + 280], start=angle, end=angle+90, fill=(0, 223, 216), width=3)
        draw.arc([center_x - 280, center_y - 280, center_x + 280, center_y + 280], start=angle+180, end=angle+270, fill=(0, 223, 216), width=3)
        
        text = "A V E N G E R S // LOAD_SYS"
        text_w = draw.textlength(text, font=font_medium)
        draw.text((center_x - text_w // 2, center_y + 400), text, fill=(255, 255, 255), font=font_medium)
        
        img.save(os.path.join(part0_dir, f"frame_{i:03d}.png"), "PNG")
    save_desc(anim_dir)

# ── 3. Breaking Bad Elements ──────────────────────────────────────────────────
def render_breaking_bad():
    anim_dir = os.path.join(OUTPUT_BASE_DIR, "breaking_bad")
    part0_dir = os.path.join(anim_dir, "part0")
    os.makedirs(part0_dir, exist_ok=True)
    
    print("⚗️ Rendering Breaking Bad Periodic Gas...")
    # Track particles
    particles = [{"x": random.randint(center_x - 250, center_x + 250), "y": random.randint(center_y, center_y + 600), "size": random.randint(4, 12), "speed": random.randint(3, 8)} for _ in range(50)]
    
    for i in range(TOTAL_FRAMES):
        img = Image.new("RGB", (WIDTH, HEIGHT), (0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Draw green gas particles
        for p in particles:
            p["y"] -= p["speed"]
            if p["y"] < center_y - 200:
                p["y"] = center_y + 600
                p["x"] = random.randint(center_x - 250, center_x + 250)
            
            alpha = int(255 * ((p["y"] - (center_y - 200)) / 800))
            draw.ellipse([p["x"]-p["size"], p["y"]-p["size"], p["x"]+p["size"], p["y"]+p["size"]], fill=(34, 197, 94, max(0, min(alpha, 255))))
            
        # Draw periodic table box [Br]
        # x start: center_x - 220, width 180, height 180
        draw.rectangle([center_x - 220, center_y - 120, center_x - 40, center_y + 60], outline=(34, 197, 94), width=5)
        draw.text((center_x - 205, center_y - 110), "35", fill=(34, 197, 94), font=font_small)
        draw.text((center_x - 175, center_y - 75), "Br", fill=(255, 255, 255), font=font_large)
        draw.text((center_x - 205, center_y + 20), "79.90", fill=(34, 197, 94), font=font_small)
        
        # Draw periodic table box [Ba]
        draw.rectangle([center_x + 40, center_y - 120, center_x + 220, center_y + 60], outline=(34, 197, 94), width=5)
        draw.text((center_x + 55, center_y - 110), "56", fill=(34, 197, 94), font=font_small)
        draw.text((center_x + 85, center_y - 75), "Ba", fill=(255, 255, 255), font=font_large)
        draw.text((center_x + 55, center_y + 20), "137.3", fill=(34, 197, 94), font=font_small)
        
        text = "BREAKING // BAD_INTEGRITY"
        text_w = draw.textlength(text, font=font_medium)
        draw.text((center_x - text_w // 2, center_y + 220), text, fill=(34, 197, 94), font=font_medium)
        
        img.save(os.path.join(part0_dir, f"frame_{i:03d}.png"), "PNG")
    save_desc(anim_dir)

# ── 4. ARC Reactor ────────────────────────────────────────────────────────────
def render_arc_reactor():
    anim_dir = os.path.join(OUTPUT_BASE_DIR, "arc_reactor")
    part0_dir = os.path.join(anim_dir, "part0")
    os.makedirs(part0_dir, exist_ok=True)
    
    print("⚛️ Rendering Iron Man Arc Reactor...")
    for i in range(TOTAL_FRAMES):
        img = Image.new("RGB", (WIDTH, HEIGHT), (0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Pulse core
        pulse = math.sin((i / TOTAL_FRAMES) * math.pi * 2)
        core_r = 80 + int(8 * pulse)
        
        # Inner core
        draw.ellipse([center_x - core_r, center_y - core_r, center_x + core_r, center_y + core_r], fill=(0, 223, 216), outline=(255, 255, 255), width=3)
        
        # Segmented middle ring (rotates)
        angle = (i / TOTAL_FRAMES) * 360
        r_mid = 180
        draw.arc([center_x - r_mid, center_y - r_mid, center_x + r_mid, center_y + r_mid], start=angle, end=angle+300, fill=(0, 150, 255), width=8)
        
        # Draw 10 Circular Coils (Iron Man style)
        for coil_idx in range(10):
            coil_angle = (coil_idx * 36) + (angle * 0.2)
            rad = math.radians(coil_angle)
            cx = center_x + int(240 * math.cos(rad))
            cy = center_y + int(240 * math.sin(rad))
            
            # Coil box
            draw.ellipse([cx - 20, cy - 20, cx + 20, cy + 20], fill=(0, 223, 216), outline=(255, 255, 255), width=2)
            
        # Outer pulsing rings
        outer_r = 290 + int(5 * pulse)
        draw.ellipse([center_x - outer_r, center_y - outer_r, center_x + outer_r, center_y + outer_r], outline=(0, 223, 216), width=3)
        
        text = "STARK_IND // ARC_v3.2"
        text_w = draw.textlength(text, font=font_medium)
        draw.text((center_x - text_w // 2, center_y + 400), text, fill=(0, 223, 216), font=font_medium)
        
        img.save(os.path.join(part0_dir, f"frame_{i:03d}.png"), "PNG")
    save_desc(anim_dir)

# ── 5. DNA Helix ──────────────────────────────────────────────────────────────
def render_dna():
    anim_dir = os.path.join(OUTPUT_BASE_DIR, "dna_helix")
    part0_dir = os.path.join(anim_dir, "part0")
    os.makedirs(part0_dir, exist_ok=True)
    
    print("🧬 Rendering DNA Double Helix 3D Rotation...")
    for i in range(TOTAL_FRAMES):
        img = Image.new("RGB", (WIDTH, HEIGHT), (0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        nodes = 18
        y_start = center_y - 500
        spacing = 60
        
        for n in range(nodes):
            y = y_start + n * spacing
            theta = (i / TOTAL_FRAMES) * 2 * math.pi + n * 0.35
            
            x1 = center_x + int(220 * math.cos(theta))
            x2 = center_x - int(220 * math.sin(theta + math.pi/2)) # Shifted for nice wave layout
            
            # Draw ladder line
            draw.line([(x1, y), (x2, y)], fill=(80, 80, 90), width=2)
            
            # Draw balls with simple depth scaling
            z1 = math.sin(theta) # front vs back indicators
            z2 = math.cos(theta + math.pi/2)
            
            r1 = int(12 + 6 * z1)
            r2 = int(12 + 6 * z2)
            
            # Front node gets brighter color
            c1 = (0, 223, 216) if z1 > 0 else (0, 100, 110)
            c2 = (139, 92, 246) if z2 > 0 else (70, 40, 120)
            
            draw.ellipse([x1-r1, y-r1, x1+r1, y+r1], fill=c1)
            draw.ellipse([x2-r2, y-r2, x2+r2, y+r2], fill=c2)
            
        text = "GEN_CODE // HELIX_SEQUENCE"
        text_w = draw.textlength(text, font=font_medium)
        draw.text((center_x - text_w // 2, center_y + 600), text, fill=(139, 92, 246), font=font_medium)
        
        img.save(os.path.join(part0_dir, f"frame_{i:03d}.png"), "PNG")
    save_desc(anim_dir)

# ── 6. Matrix Rain ────────────────────────────────────────────────────────────
def render_matrix():
    anim_dir = os.path.join(OUTPUT_BASE_DIR, "matrix_rain")
    part0_dir = os.path.join(anim_dir, "part0")
    os.makedirs(part0_dir, exist_ok=True)
    
    print("💻 Rendering Matrix Digital Rain...")
    columns = 20
    col_width = WIDTH // columns
    # Set starting position trails
    trails = [{"y": random.randint(-1000, 0), "speed": random.randint(30, 60), "chars": [random.choice("0123456789ABCDEF") for _ in range(30)]} for _ in range(columns)]
    
    for i in range(TOTAL_FRAMES):
        img = Image.new("RGB", (WIDTH, HEIGHT), (0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        for c_idx, t in enumerate(trails):
            t["y"] += t["speed"]
            if t["y"] > HEIGHT + 600:
                t["y"] = random.randint(-500, 0)
                t["speed"] = random.randint(30, 60)
            
            # Draw vertical characters stream
            char_y_spacing = 40
            for char_idx, char in enumerate(t["chars"]):
                cy = t["y"] - (char_idx * char_y_spacing)
                if 0 <= cy < HEIGHT:
                    # Fading trail opacity
                    alpha = int(255 * (1 - (char_idx / len(t["chars"]))))
                    color = (255, 255, 255) if char_idx == 0 else (34, 197, 94) # Head is white, body is green
                    
                    draw.text((c_idx * col_width + 10, cy), char, fill=color, font=font_small)
                    
            # Mutate characters slowly
            if random.random() < 0.1:
                t["chars"][random.randint(0, len(t["chars"])-1)] = random.choice("0123456789ABCDEF")
                
        # Draw central glowing terminal panel
        panel_w, panel_h = 600, 160
        draw.rectangle([center_x - panel_w//2, center_y - panel_h//2, center_x + panel_w//2, center_y + panel_h//2], fill=(0, 0, 0), outline=(34, 197, 94), width=3)
        
        text = f"LOAD_MATRIX_SYS: {int((i/59)*100)}%"
        text_w = draw.textlength(text, font=font_medium)
        draw.text((center_x - text_w // 2, center_y - 20), text, fill=(34, 197, 94), font=font_medium)
        
        img.save(os.path.join(part0_dir, f"frame_{i:03d}.png"), "PNG")
    save_desc(anim_dir)

# ── 7. Quantum Portal ─────────────────────────────────────────────────────────
def render_quantum_portal():
    anim_dir = os.path.join(OUTPUT_BASE_DIR, "quantum_portal")
    part0_dir = os.path.join(anim_dir, "part0")
    os.makedirs(part0_dir, exist_ok=True)
    
    print("🌀 Rendering Swirling Quantum Singularity...")
    for i in range(TOTAL_FRAMES):
        img = Image.new("RGB", (WIDTH, HEIGHT), (0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Spiral particles
        angle_start = (i / TOTAL_FRAMES) * math.pi * 2
        particles_count = 120
        
        for p_idx in range(particles_count):
            t = p_idx / particles_count
            theta = angle_start + t * math.pi * 8
            
            # Collapse radius inward
            radius = 350 * (1 - t)
            
            cx = center_x + int(radius * math.cos(theta))
            cy = center_y + int(radius * math.sin(theta))
            
            # Pulse particles
            p_size = int(6 * (1 - t) + 2)
            
            # Fade colors towards center (Cyan -> Violet -> Black)
            r = int(139 * t)
            g = int(223 * (1 - t))
            b = 255
            
            draw.ellipse([cx - p_size, cy - p_size, cx + p_size, cy + p_size], fill=(r, g, b))
            
        # Pulsing center gravity core
        pulse = math.sin((i / TOTAL_FRAMES) * math.pi * 2)
        core_r = 15 + int(5 * pulse)
        draw.ellipse([center_x - core_r, center_y - core_r, center_x + core_r, center_y + core_r], fill=(255, 255, 255))
        
        text = "SINGULARITY // CORE_ONLINE"
        text_w = draw.textlength(text, font=font_medium)
        draw.text((center_x - text_w // 2, center_y + 460), text, fill=(0, 223, 216), font=font_medium)
        
        img.save(os.path.join(part0_dir, f"frame_{i:03d}.png"), "PNG")
    save_desc(anim_dir)

# ── 8. Hyperspace Warp ────────────────────────────────────────────────────────
def render_hyperspace():
    anim_dir = os.path.join(OUTPUT_BASE_DIR, "hyperspace_warp")
    part0_dir = os.path.join(anim_dir, "part0")
    os.makedirs(part0_dir, exist_ok=True)
    
    print("🚀 Rendering Hyperspace Star Streaks...")
    stars = [{"theta": random.uniform(0, math.pi * 2), "speed": random.uniform(5, 15), "dist": random.uniform(10, 200)} for _ in range(80)]
    
    for i in range(TOTAL_FRAMES):
        img = Image.new("RGB", (WIDTH, HEIGHT), (0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        for s in stars:
            s["dist"] += s["speed"]
            # Accelerate stars as they move away
            s["speed"] += 0.8
            
            if s["dist"] > 800:
                s["dist"] = random.uniform(5, 50)
                s["speed"] = random.uniform(5, 15)
                s["theta"] = random.uniform(0, math.pi * 2)
                
            # Draw line streak from previous coordinate to current
            prev_dist = max(5, s["dist"] - s["speed"] * 1.5)
            
            x_start = center_x + int(prev_dist * math.cos(s["theta"]))
            y_start = center_y + int(prev_dist * math.sin(s["theta"]))
            x_end = center_x + int(s["dist"] * math.cos(s["theta"]))
            y_end = center_y + int(s["dist"] * math.sin(s["theta"]))
            
            # Streaks get brighter as they move outward
            alpha = min(255, int(255 * (s["dist"] / 600)))
            color = (alpha, alpha, 255)  # Cyan/white star streaks
            
            draw.line([(x_start, y_start), (x_end, y_end)], fill=color, width=int(2 * (s["dist"] / 400) + 1))
            
        # Draw tech coordinate layout in center
        draw.ellipse([center_x - 100, center_y - 100, center_x + 100, center_y + 100], outline=(0, 223, 216, 80), width=1)
        draw.line([(center_x - 150, center_y), (center_x + 150, center_y)], fill=(0, 223, 216, 60), width=1)
        draw.line([(center_x, center_y - 150), (center_x, center_y + 150)], fill=(0, 223, 216, 60), width=1)
        
        text = "HYPER_DRIVE // SPEED_WARP"
        text_w = draw.textlength(text, font=font_medium)
        draw.text((center_x - text_w // 2, center_y + 500), text, fill=(255, 255, 255), font=font_medium)
        
        img.save(os.path.join(part0_dir, f"frame_{i:03d}.png"), "PNG")
    save_desc(anim_dir)

# ── 9. Cyber Grid ─────────────────────────────────────────────────────────────
def render_cyber_grid():
    anim_dir = os.path.join(OUTPUT_BASE_DIR, "cyber_grid")
    part0_dir = os.path.join(anim_dir, "part0")
    os.makedirs(part0_dir, exist_ok=True)
    
    print("🌅 Rendering Outrun Retro Cyber Grid Sunset...")
    for i in range(TOTAL_FRAMES):
        img = Image.new("RGB", (WIDTH, HEIGHT), (0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Horizon Line Y pos
        horizon_y = 1200
        
        # 1. Draw glowing concentric retro sunset above horizon
        sunset_center_y = horizon_y
        for r_idx in range(6):
            r = 300 - (r_idx * 40)
            # Orange to Pink gradient
            color = (255, int(100 + r_idx * 20), 0)
            # Clip sunset to stay above horizon
            draw.chord(
                [center_x - r, sunset_center_y - r, center_x + r, sunset_center_y + r],
                start=180,
                end=360,
                fill=color
            )
            
        # Draw horizontal laser line cuts through the sunset (classic outrun look)
        for cut_idx in range(5):
            cut_y = horizon_y - 60 - (cut_idx * 50)
            draw.line([(0, cut_y), (WIDTH, cut_y)], fill=(0, 0, 0), width=10)
            
        # 2. Draw 3D perspective Grid lines converging to the horizon
        for grid_col in range(13):
            # X coordinate on bottom edge
            x_bottom = (grid_col - 6) * 200 + center_x
            draw.line([(center_x, horizon_y), (x_bottom, HEIGHT)], fill=(139, 92, 246), width=2)
            
        # 3. Draw moving horizontal grid lines (simulates moving forward)
        move_offset = (i / TOTAL_FRAMES)
        grid_lines = 15
        for line_idx in range(grid_lines):
            # Logarithmic distribution creates perspective spacing
            t = (line_idx + move_offset) / grid_lines
            line_y = horizon_y + int((HEIGHT - horizon_y) * math.pow(t, 2.5))
            
            if horizon_y <= line_y <= HEIGHT:
                draw.line([(0, line_y), (WIDTH, line_y)], fill=(139, 92, 246), width=1)
                
        # Draw solid horizon laser line (bright cyan)
        draw.line([(0, horizon_y), (WIDTH, horizon_y)], fill=(0, 223, 216), width=3)
        
        text = "RETRO_GRID // SYS_ON"
        text_w = draw.textlength(text, font=font_medium)
        draw.text((center_x - text_w // 2, horizon_y - 420), text, fill=(0, 223, 216), font=font_medium)
        
        img.save(os.path.join(part0_dir, f"frame_{i:03d}.png"), "PNG")
    save_desc(anim_dir)

# ── 10. Sharingan Eye ─────────────────────────────────────────────────────────
def render_sharingan():
    anim_dir = os.path.join(OUTPUT_BASE_DIR, "sharingan_eye")
    part0_dir = os.path.join(anim_dir, "part0")
    os.makedirs(part0_dir, exist_ok=True)
    
    print("👁️  Rendering Spinning Sharingan Eye Tomoes...")
    for i in range(TOTAL_FRAMES):
        img = Image.new("RGB", (WIDTH, HEIGHT), (0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Red Iris
        r_iris = 240
        draw.ellipse([center_x - r_iris, center_y - r_iris, center_x + r_iris, center_y + r_iris], fill=(220, 20, 20), outline=(255, 255, 255), width=3)
        
        # Inner black HUD concentric line
        draw.ellipse([center_x - 150, center_y - 150, center_x + 150, center_y + 150], outline=(0, 0, 0), width=3)
        
        # Black Pupil
        r_pupil = 50
        draw.ellipse([center_x - r_pupil, center_y - r_pupil, center_x + r_pupil, center_y + r_pupil], fill=(0, 0, 0))
        
        # Rotation angle for Tomoe symbols
        angle_start = (i / TOTAL_FRAMES) * 360
        
        # Draw 3 Tomoe symbols on the circular line
        for t_idx in range(3):
            t_angle = angle_start + (t_idx * 120)
            rad = math.radians(t_angle)
            
            # Position of the Tomoe circle
            tx = center_x + int(150 * math.cos(rad))
            ty = center_y + int(150 * math.sin(rad))
            
            # Draw Tomoe body (black circle)
            r_tomoe = 26
            draw.ellipse([tx - r_tomoe, ty - r_tomoe, tx + r_tomoe, ty + r_tomoe], fill=(0, 0, 0))
            
            # Draw Tomoe tail hook (drawn using arc/curved coordinates)
            draw.arc([tx - r_tomoe - 8, ty - r_tomoe - 8, tx + r_tomoe + 8, ty + r_tomoe + 8], start=t_angle + 90, end=t_angle + 270, fill=(0, 0, 0), width=10)
            
        text = "SHARINGAN // JUTSU_SYS"
        text_w = draw.textlength(text, font=font_medium)
        draw.text((center_x - text_w // 2, center_y + 400), text, fill=(255, 255, 255), font=font_medium)
        
        img.save(os.path.join(part0_dir, f"frame_{i:03d}.png"), "PNG")
    save_desc(anim_dir)

# ── Execution Loop ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    os.makedirs(OUTPUT_BASE_DIR, exist_ok=True)
    
    render_ronaldo_siu()
    render_avengers()
    render_breaking_bad()
    render_arc_reactor()
    render_dna()
    render_matrix()
    render_quantum_portal()
    render_hyperspace()
    render_cyber_grid()
    render_sharingan()
    
    print("\n👑 All 10 high-end animations generated successfully in /home/hasan/bootanimation-gallery/scratch/gallery!")
