import os
import sys
import subprocess
import shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg
import cv2

WIDTH = 1080
HEIGHT = 1920
FPS = 41.04144199661069
TOTAL_FRAMES = 444
BG_COLOR = (250, 250, 250)

PROJECT_DIR = r"c:\Users\ASUS\Desktop\Project\Shopify"
DARKER_DIR = r"C:\Users\ASUS\Pictures\Darker_Grotesque"
SCRATCH_DIR = r"C:\Users\ASUS\.gemini\antigravity\brain\09c70ccb-25e6-44e1-ba39-a9bfed22eb84\scratch"
AUDIO_PATH = os.path.join(SCRATCH_DIR, "extracted_audio.aac")

BODONI_FONT_PATH = r"C:\Windows\Fonts\Bodoni Bk BT Book.ttf"
if not os.path.exists(BODONI_FONT_PATH):
    BODONI_FONT_PATH = r"C:\Windows\Fonts\georgia.ttf"

def extract_alpha(img_path, threshold=22):
    im = Image.open(img_path).convert('RGB')
    arr = np.array(im)
    h, w, _ = arr.shape
    corners = np.vstack([arr[:10, :10], arr[:10, -10:], arr[-10:, :10], arr[-10:, -10:]])
    bg_color = np.median(corners.reshape(-1, 3), axis=0)
    
    dist = np.linalg.norm(arr.astype(float) - bg_color, axis=2)
    mask = np.zeros((h, w), dtype=np.uint8)
    mask[dist > threshold] = 255
    
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    
    h_pad, w_pad = h + 2, w + 2
    ff_mask = np.zeros((h_pad, w_pad), dtype=np.uint8)
    inv_mask = (255 - mask).copy()
    cv2.floodFill(inv_mask, ff_mask, (0, 0), 128)
    cv2.floodFill(inv_mask, ff_mask, (w-1, 0), 128)
    cv2.floodFill(inv_mask, ff_mask, (0, h-1), 128)
    cv2.floodFill(inv_mask, ff_mask, (w-1, h-1), 128)
    
    final_alpha = np.where(inv_mask == 128, 0, 255).astype(np.uint8)
    final_alpha = cv2.GaussianBlur(final_alpha, (3, 3), 0.5)
    
    rgba = np.dstack([arr, final_alpha])
    res = Image.fromarray(rgba, 'RGBA')
    bbox = res.getbbox()
    if bbox:
        res = res.crop(bbox)
    return res

def resize_max(img, max_w, max_h):
    ratio = min(max_w / img.width, max_h / img.height)
    nw, nh = max(1, int(img.width * ratio)), max(1, int(img.height * ratio))
    return img.resize((nw, nh), Image.LANCZOS)

def build_vector_hand(target_length=235):
    S = 600
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    cx = S // 2
    cy = S // 2
    
    tip_y = cy - target_length
    total_len = target_length
    
    sw = max(4, int(total_len * 0.018))
    ring_outer = max(10, int(total_len * 0.065))
    ring_inner = max(4, int(total_len * 0.030))
    
    draw.ellipse([cx - ring_outer, cy - ring_outer, cx + ring_outer, cy + ring_outer], fill=(15, 15, 15, 255))
    tail_len = int(total_len * 0.08)
    draw.polygon([(cx, cy + ring_outer + tail_len), (cx - 3, cy + ring_outer - 2), (cx + 3, cy + ring_outer - 2)], fill=(15, 15, 15, 255))
    
    o1_bottom = cy - int(total_len * 0.48)
    draw.rectangle([cx - sw//2, o1_bottom, cx + sw//2, cy], fill=(15, 15, 15, 255))
    
    o1_h = int(total_len * 0.075)
    o1_w = int(total_len * 0.045)
    o1_cy = o1_bottom - o1_h
    draw.polygon([
        (cx, o1_cy - o1_h),
        (cx + o1_w, o1_cy),
        (cx, o1_cy + o1_h),
        (cx - o1_w, o1_cy)
    ], fill=(15, 15, 15, 255))
    draw.ellipse([cx - o1_w + 2, o1_cy - o1_w + 2, cx + o1_w - 2, o1_cy + o1_w - 2], fill=(15, 15, 15, 255))
    
    neck_h = int(total_len * 0.04)
    neck_top = o1_cy - o1_h - neck_h
    draw.rectangle([cx - sw//2, neck_top, cx + sw//2, o1_cy - o1_h], fill=(15, 15, 15, 255))
    
    o2_h = int(total_len * 0.055)
    o2_w = int(total_len * 0.032)
    o2_cy = neck_top - o2_h
    draw.polygon([
        (cx, o2_cy - o2_h),
        (cx + o2_w, o2_cy),
        (cx, o2_cy + o2_h),
        (cx - o2_w, o2_cy)
    ], fill=(15, 15, 15, 255))
    draw.ellipse([cx - o2_w + 1, o2_cy - o2_w + 1, cx + o2_w - 1, o2_cy + o2_w - 1], fill=(15, 15, 15, 255))
    
    needle_base = o2_cy - o2_h
    draw.polygon([
        (cx - 2, needle_base),
        (cx + 2, needle_base),
        (cx + 1, tip_y + 20),
        (cx - 1, tip_y + 20)
    ], fill=(15, 15, 15, 255))
    draw.polygon([
        (cx - 1, tip_y + 20),
        (cx + 1, tip_y + 20),
        (cx, tip_y)
    ], fill=(15, 15, 15, 255))
    
    draw.ellipse([cx - ring_inner, cy - ring_inner, cx + ring_inner, cy + ring_inner], fill=(0, 0, 0, 0))
    
    return img, (cx, cy)

def draw_clock_face(draw, cx, cy, dial_r=300, font_path=BODONI_FONT_PATH):
    import math
    rim_color = (210, 210, 210)
    rim_outer_color = (225, 225, 225)
    tick_minute_color = (200, 200, 200)
    tick_hour_color = (40, 40, 40)
    numeral_color = (30, 30, 30)

    # 1. Subtle dial background circle (pure white to pop against the off-white stage)
    draw.ellipse([cx - dial_r, cy - dial_r, cx + dial_r, cy + dial_r], fill=(255, 255, 255), outline=rim_color, width=1)
    
    # Outer track circle slightly offset
    track_r = dial_r - 8
    draw.ellipse([cx - track_r, cy - track_r, cx + track_r, cy + track_r], outline=rim_outer_color, width=1)

    # 2. 60 minute ticks & 12 hour ticks
    for m in range(60):
        angle_rad = math.radians(m * 6 - 90)
        cos_a = math.cos(angle_rad)
        sin_a = math.sin(angle_rad)

        if m % 5 == 0:
            # Hour tick
            t_outer = dial_r - 2
            t_inner = dial_r - 18
            x1 = cx + t_outer * cos_a
            y1 = cy + t_outer * sin_a
            x2 = cx + t_inner * cos_a
            y2 = cy + t_inner * sin_a
            draw.line([(x1, y1), (x2, y2)], fill=tick_hour_color, width=2)
        else:
            # Minute tick
            t_outer = dial_r - 4
            t_inner = dial_r - 12
            x1 = cx + t_outer * cos_a
            y1 = cy + t_outer * sin_a
            x2 = cx + t_inner * cos_a
            y2 = cy + t_inner * sin_a
            draw.line([(x1, y1), (x2, y2)], fill=tick_minute_color, width=1)

    # 3. 12 Roman numerals (XII, I, II, ... XI)
    roman_numerals = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"]
    try:
        font_roman = ImageFont.truetype(font_path, 28)
    except Exception:
        font_roman = ImageFont.load_default()
    num_r = dial_r - 64

    for h in range(12):
        angle_rad = math.radians(h * 30 - 90)
        cos_a = math.cos(angle_rad)
        sin_a = math.sin(angle_rad)

        nx = cx + num_r * cos_a
        ny = cy + num_r * sin_a

        rom = roman_numerals[h]
        bbox = draw.textbbox((0, 0), rom, font=font_roman)
        rw = bbox[2] - bbox[0]
        rh = bbox[3] - bbox[1]

        draw.text((nx - rw / 2, ny - rh / 2), rom, font=font_roman, fill=numeral_color)

def render_animation(words_list, output_mp4, title_subtitle="CABALLO & ALTORO BLACK PANT"):
    print(f"\n==========================================")
    print(f"Rendering: {os.path.basename(output_mp4)}")
    print(f"Words: {words_list}")
    print(f"==========================================")

    # 1. Prepare assets
    print("Preparing high-resolution product cutouts...")
    cab_front = extract_alpha(os.path.join(DARKER_DIR, "IMG_7318.JPEG"))
    cab_back = extract_alpha(os.path.join(DARKER_DIR, "IMG_7316.JPEG"))
    alt_front = extract_alpha(os.path.join(DARKER_DIR, "IMG_7305.PNG"))
    alt_back = extract_alpha(os.path.join(DARKER_DIR, "IMG_7303.PNG"))

    cw, ch = cab_front.size
    detail_cab = cab_front.crop((int(cw * 0.04), int(ch * 0.38), int(cw * 0.52), int(ch * 0.95)))

    aw, ah = alt_front.size
    detail_alt = alt_front.crop((int(aw * 0.05), int(ah * 0.44), int(aw * 0.95), int(ah * 0.98)))

    g_cab_front = resize_max(cab_front, 290, 330)
    g_alt_front = resize_max(alt_front, 260, 360)
    g_cab_back = resize_max(cab_back, 290, 330)
    g_alt_back = resize_max(alt_back, 260, 360)
    g_cab_detail = resize_max(detail_cab, 250, 290)
    g_alt_detail = resize_max(detail_alt, 270, 270)

    hand_square, pivot = build_vector_hand(target_length=235)
    hs_w, hs_h = hand_square.size

    PIVOT_X = WIDTH // 2
    PIVOT_Y = HEIGHT // 2

    POSITIONS = [
        {"name": "12:00", "cx": 540, "cy": 470, "angle": 0},
        {"name": "2:00",  "cx": 920, "cy": 720, "angle": 60},
        {"name": "4:00",  "cx": 920, "cy": 1200, "angle": 120},
        {"name": "6:00",  "cx": 540, "cy": 1450, "angle": 180},
        {"name": "8:00",  "cx": 160, "cy": 1200, "angle": 240},
        {"name": "10:00", "cx": 160, "cy": 720, "angle": 300},
    ]

    GARMENTS = [
        g_cab_front,
        g_alt_front,
        g_cab_back,
        g_alt_back,
        g_cab_detail,
        g_alt_detail
    ]

    font_word = ImageFont.truetype(BODONI_FONT_PATH, 62)
    font_title = ImageFont.truetype(BODONI_FONT_PATH, 72)
    font_sub = ImageFont.truetype(BODONI_FONT_PATH, 40)
    font_cta = ImageFont.truetype(BODONI_FONT_PATH, 50)

    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    temp_raw_video = os.path.join(SCRATCH_DIR, "temp_raw.mp4")

    cmd_video = [
        ffmpeg_exe, "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "medium",
        "-crf", "17",
        temp_raw_video
    ]

    pipe = subprocess.Popen(cmd_video, stdin=subprocess.PIPE)

    print("Rendering frames...")
    for frame_idx in range(TOTAL_FRAMES):
        frame = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
        draw = ImageDraw.Draw(frame)

        if frame_idx < 315:
            if frame_idx < 101:
                step = 0
                prev_angle = 0
                target_angle = 0
                tick_prog = 1.0
            elif frame_idx < 154:
                step = 1
                prev_angle = POSITIONS[0]["angle"]
                target_angle = POSITIONS[1]["angle"]
                tick_prog = min(1.0, (frame_idx - 101) / 3.0)
            elif frame_idx < 205:
                step = 2
                prev_angle = POSITIONS[1]["angle"]
                target_angle = POSITIONS[2]["angle"]
                tick_prog = min(1.0, (frame_idx - 154) / 3.0)
            elif frame_idx < 255:
                step = 3
                prev_angle = POSITIONS[2]["angle"]
                target_angle = POSITIONS[3]["angle"]
                tick_prog = min(1.0, (frame_idx - 205) / 3.0)
            elif frame_idx < 287:
                step = 4
                prev_angle = POSITIONS[3]["angle"]
                target_angle = POSITIONS[4]["angle"]
                tick_prog = min(1.0, (frame_idx - 255) / 3.0)
            else:
                step = 5
                prev_angle = POSITIONS[4]["angle"]
                target_angle = POSITIONS[5]["angle"]
                tick_prog = min(1.0, (frame_idx - 287) / 3.0)

            current_angle = prev_angle + (target_angle - prev_angle) * (1.0 if tick_prog >= 1.0 else (tick_prog ** 2))

            # 1. Draw luxury clock face with double rim, 60 minute ticks, and 12 Roman numerals
            draw_clock_face(draw, PIVOT_X, PIVOT_Y, dial_r=300)

            for p_idx in range(6):
                pos = POSITIONS[p_idx]
                word = words_list[p_idx]
                g_img = GARMENTS[p_idx]

                show_word = (step == p_idx)

                if show_word:
                    bbox = draw.textbbox((0, 0), word, font=font_word)
                    tw = bbox[2] - bbox[0]
                    th = bbox[3] - bbox[1]
                    tx = pos["cx"] - tw // 2
                    ty = pos["cy"] - th // 2
                    draw.text((tx, ty), word, font=font_word, fill=(20, 20, 20))
                else:
                    gx = pos["cx"] - g_img.width // 2
                    gy = pos["cy"] - g_img.height // 2
                    frame.paste(g_img, (gx, gy), g_img)

            rot_hand = hand_square.rotate(-current_angle, resample=Image.BICUBIC, center=pivot)
            hx = PIVOT_X - hs_w // 2
            hy = PIVOT_Y - hs_h // 2
            frame.paste(rot_hand, (hx, hy), rot_hand)

            # Center pivot pin
            draw.ellipse([PIVOT_X - 5, PIVOT_Y - 5, PIVOT_X + 5, PIVOT_Y + 5], fill=(15, 15, 15))

        elif frame_idx < 356:
            pass

        else:
            line1 = "OUTTERSPACE"
            line2 = "COWBOY SERIES 2026"
            line3 = "—"
            line4 = title_subtitle
            line5 = "PRE-ORDER AVAILABLE NOW"

            b1 = draw.textbbox((0, 0), line1, font=font_title)
            b2 = draw.textbbox((0, 0), line2, font=font_sub)
            b3 = draw.textbbox((0, 0), line3, font=font_sub)
            b4 = draw.textbbox((0, 0), line4, font=font_cta)
            b5 = draw.textbbox((0, 0), line5, font=font_sub)

            cy_start = HEIGHT // 2 - 160

            draw.text((WIDTH//2 - (b1[2]-b1[0])//2, cy_start), line1, font=font_title, fill=(15, 15, 15))
            draw.text((WIDTH//2 - (b2[2]-b2[0])//2, cy_start + 90), line2, font=font_sub, fill=(60, 60, 60))
            draw.text((WIDTH//2 - (b3[2]-b3[0])//2, cy_start + 140), line3, font=font_sub, fill=(120, 120, 120))
            draw.text((WIDTH//2 - (b4[2]-b4[0])//2, cy_start + 180), line4, font=font_cta, fill=(15, 15, 15))
            draw.text((WIDTH//2 - (b5[2]-b5[0])//2, cy_start + 260), line5, font=font_sub, fill=(80, 80, 80))

        pipe.stdin.write(frame.tobytes())

        if (frame_idx + 1) % 100 == 0 or frame_idx == TOTAL_FRAMES - 1:
            print(f"Rendered {frame_idx + 1}/{TOTAL_FRAMES} frames ({(frame_idx+1)/TOTAL_FRAMES*100:.1f}%)")

    pipe.stdin.close()
    pipe.wait()

    print("Muxing audio track...")
    os.makedirs(os.path.dirname(output_mp4), exist_ok=True)
    if os.path.exists(AUDIO_PATH):
        cmd_mux = [
            ffmpeg_exe, "-y",
            "-i", temp_raw_video,
            "-i", AUDIO_PATH,
            "-c:v", "copy",
            "-c:a", "aac",
            "-shortest",
            output_mp4
        ]
    else:
        cmd_mux = [
            ffmpeg_exe, "-y",
            "-i", temp_raw_video,
            "-c:v", "copy",
            output_mp4
        ]
    subprocess.run(cmd_mux, check=True)
    if os.path.exists(temp_raw_video):
        os.remove(temp_raw_video)
    print(f"Successfully rendered: {output_mp4} ({os.path.getsize(output_mp4):,} bytes)")

if __name__ == "__main__":
    words_option_a = ["REAL", "FRIENDS", "WITH", "YOU", "THROUGH", "TIME"]
    out_v1_user = os.path.join(DARKER_DIR, "outterspace_clock_animation_v1.mp4")
    out_v1_project = os.path.join(PROJECT_DIR, "assets", "videos", "outterspace_clock_animation_v1.mp4")
    out_v1_storefront = os.path.join(PROJECT_DIR, "storefront", "assets", "videos", "outterspace_clock_animation_v1.mp4")

    render_animation(words_option_a, out_v1_user, "CABALLO & ALTORO BLACK PANT")
    shutil.copy2(out_v1_user, out_v1_project)
    shutil.copy2(out_v1_user, out_v1_storefront)

    words_option_b = ["OUTTERSPACE", "COWBOY", "SERIES", "PRE-ORDER", "AVAILABLE", "NOW"]
    out_v2_user = os.path.join(DARKER_DIR, "outterspace_clock_animation_v2.mp4")
    out_v2_project = os.path.join(PROJECT_DIR, "assets", "videos", "outterspace_clock_animation_v2.mp4")
    out_v2_storefront = os.path.join(PROJECT_DIR, "storefront", "assets", "videos", "outterspace_clock_animation_v2.mp4")

    render_animation(words_option_b, out_v2_user, "CABALLO & ALTORO BLACK PANT")
    shutil.copy2(out_v2_user, out_v2_project)
    shutil.copy2(out_v2_user, out_v2_storefront)

    print("\nALL ANIMATIONS GENERATED AND DEPLOYED SUCCESSFULLY!")
