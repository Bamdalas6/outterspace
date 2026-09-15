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
AUDIO_PATH = os.path.join(SCRATCH_DIR, "clean_luxury_clock.aac")

BODONI_FONT_PATH = r"C:\Windows\Fonts\Bodoni Bk BT Book.ttf"
if not os.path.exists(BODONI_FONT_PATH):
    BODONI_FONT_PATH = r"C:\Windows\Fonts\georgia.ttf"

def generate_luxury_clock_audio(audio_path):
    import wave
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    # Tactile physical click from Windows system audio
    nav_path = r"C:\Windows\Media\Windows Navigation Start.wav"
    nav = None
    if os.path.exists(nav_path):
        with wave.open(nav_path, 'rb') as wf:
            raw = wf.readframes(wf.getnframes())
            nav = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
            nav = nav.reshape(-1, 2)

    sr = 44100
    duration = TOTAL_FRAMES / FPS
    total_samples = int(duration * sr)
    audio_out = np.zeros((total_samples, 2), dtype=np.float32)

    def make_clock_click(is_tock=False):
        n_tail = int(0.14 * sr)
        t = np.arange(n_tail) / sr
        f_res1 = 380 if not is_tock else 310
        f_res2 = 190 if not is_tock else 155
        # Deep warm wooden clock resonance & brass housing
        tail = (np.sin(2 * np.pi * f_res1 * t) * 0.45 +
                np.sin(2 * np.pi * f_res2 * t) * 0.35 +
                np.sin(2 * np.pi * 95 * t) * 0.25) * np.exp(-t / 0.038)
        
        if nav is not None:
            speed = 0.92 if is_tock else 1.0
            indices = np.arange(0, len(nav), speed)
            indices = indices[indices < len(nav)].astype(int)
            click = nav[indices].copy()
            out_len = max(len(click), n_tail)
            out = np.zeros((out_len, 2), dtype=np.float32)
            out[:len(click)] += click * 0.82
            out[:n_tail, 0] += tail * 0.38
            out[:n_tail, 1] += tail * 0.38
        else:
            out = np.zeros((n_tail, 2), dtype=np.float32)
            out[:, 0] = tail
            out[:, 1] = tail
        return out

    tick_frames = [73, 115, 155, 197, 239, 280, 319]
    for idx, f in enumerate(tick_frames):
        t_start = f / FPS
        s_start = int(t_start * sr)
        is_tock = (idx % 2 == 1)
        clk = make_clock_click(is_tock=is_tock)
        if idx == len(tick_frames) - 1:
            clk = clk * 1.15
        s_end = min(total_samples, s_start + len(clk))
        audio_out[s_start:s_end] += clk[:s_end - s_start]

    # STOP ALL CLOCK SOUND COMPLETELY AFTER FINAL CLICK (frame 324 -> 7.9s)
    cutoff = int((324 / FPS) * sr)
    audio_out[cutoff:] = 0.0

    max_val = np.max(np.abs(audio_out))
    if max_val > 0:
        audio_out = (audio_out / max_val) * 0.90

    pcm = (audio_out * 32767).clip(-32768, 32767).astype(np.int16)
    temp_wav = os.path.join(SCRATCH_DIR, "temp_luxury_clock.wav")
    with wave.open(temp_wav, 'wb') as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(pcm.tobytes())

    cmd_enc = [ffmpeg_exe, "-y", "-i", temp_wav, "-c:a", "aac", "-b:a", "192k", audio_path]
    subprocess.run(cmd_enc, check=True)
    if os.path.exists(temp_wav):
        os.remove(temp_wav)
    print(f"Generated luxury clock audio: {audio_path}")

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

    # Ensure authentic luxury clock audio is generated
    generate_luxury_clock_audio(AUDIO_PATH)

    # 1. Prepare assets
    print("Preparing high-resolution product cutouts...")
    cab_front = extract_alpha(os.path.join(DARKER_DIR, "IMG_7318.JPEG"))
    cab_back = extract_alpha(os.path.join(DARKER_DIR, "IMG_7316.JPEG"))
    alt_front = extract_alpha(os.path.join(DARKER_DIR, "IMG_7305.PNG"))
    alt_back = extract_alpha(os.path.join(DARKER_DIR, "IMG_7303.PNG"))

    # User-specified replacements for the crossed-out detail positions:
    # 8:00 position -> user-attached Caballo front
    # 10:00 position -> user-attached Altoro back
    user_cab_path = os.path.join(PROJECT_DIR, "cowboy seriess", "caballo-front-hires.jpg")
    user_alt_path = os.path.join(PROJECT_DIR, "cowboy seriess", "altoro-back-hires.png")

    cab_pos4 = extract_alpha(user_cab_path) if os.path.exists(user_cab_path) else cab_front
    alt_pos5 = extract_alpha(user_alt_path) if os.path.exists(user_alt_path) else alt_back

    # Make images smaller so the composition breathes cleanly around the dial
    # Caballo: 230 x 265 (down from 290 x 330)
    # Altoro: 205 x 295 (down from 260 x 360)
    g_cab_front = resize_max(cab_front, 230, 265)
    g_alt_front = resize_max(alt_front, 205, 295)
    g_cab_back = resize_max(cab_back, 230, 265)
    g_alt_back = resize_max(alt_back, 205, 295)
    g_cab_pos4 = resize_max(cab_pos4, 230, 265)
    g_alt_pos5 = resize_max(alt_pos5, 205, 295)

    hand_square, pivot = build_vector_hand(target_length=235)
    hs_w, hs_h = hand_square.size

    PIVOT_X = WIDTH // 2
    PIVOT_Y = HEIGHT // 2

    POSITIONS = [
        {"name": "12:00", "cx": 540, "cy": 480, "angle": 0},
        {"name": "2:00",  "cx": 910, "cy": 730, "angle": 60},
        {"name": "4:00",  "cx": 910, "cy": 1190, "angle": 120},
        {"name": "6:00",  "cx": 540, "cy": 1440, "angle": 180},
        {"name": "8:00",  "cx": 170, "cy": 1190, "angle": 240},
        {"name": "10:00", "cx": 170, "cy": 730, "angle": 300},
    ]

    GARMENTS = [
        g_cab_front,  # 12:00
        g_alt_front,  # 2:00
        g_cab_back,   # 4:00
        g_alt_back,   # 6:00
        g_cab_pos4,   # 8:00 (attached Caballo front)
        g_alt_pos5    # 10:00 (attached Altoro back)
    ]

    font_word = ImageFont.truetype(BODONI_FONT_PATH, 58)
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

        if frame_idx < 319:
            # Exact audio-synchronized tick timestamps (measured directly from audio transient onsets):
            # Frame 73  (1.78s): Tick 1 -> Jump to 2:00
            # Frame 115 (2.81s): Tick 2 -> Jump to 4:00
            # Frame 155 (3.78s): Tick 3 -> Jump to 6:00
            # Frame 197 (4.81s): Tick 4 -> Jump to 8:00
            # Frame 239 (5.81s): Tick 5 -> Jump to 10:00
            # Frame 280 (6.81s): Tick 6 -> Jump to 12:00 (Full 360 circle reveal)
            if frame_idx < 73:
                step = 0
                current_angle = 0.0
            elif frame_idx < 115:
                step = 1
                df = frame_idx - 73
                prog = 0.75 if df == 0 else (1.03 if df == 1 else 1.0)
                current_angle = 0.0 + 60.0 * prog
            elif frame_idx < 155:
                step = 2
                df = frame_idx - 115
                prog = 0.75 if df == 0 else (1.03 if df == 1 else 1.0)
                current_angle = 60.0 + 60.0 * prog
            elif frame_idx < 197:
                step = 3
                df = frame_idx - 155
                prog = 0.75 if df == 0 else (1.03 if df == 1 else 1.0)
                current_angle = 120.0 + 60.0 * prog
            elif frame_idx < 239:
                step = 4
                df = frame_idx - 197
                prog = 0.75 if df == 0 else (1.03 if df == 1 else 1.0)
                current_angle = 180.0 + 60.0 * prog
            elif frame_idx < 280:
                step = 5
                df = frame_idx - 239
                prog = 0.75 if df == 0 else (1.03 if df == 1 else 1.0)
                current_angle = 240.0 + 60.0 * prog
            else:
                step = 6 # All 6 revealed!
                df = frame_idx - 280
                prog = 0.75 if df == 0 else (1.03 if df == 1 else 1.0)
                current_angle = 300.0 + 60.0 * prog

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
            line5 = "AVAILABLE NOW FOR ORDER"

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

    words_option_b = ["OUTTERSPACE", "COWBOY", "SERIES", "AVAILABLE", "FOR", "ORDER"]
    out_v2_user = os.path.join(DARKER_DIR, "outterspace_clock_animation_v2.mp4")
    out_v2_project = os.path.join(PROJECT_DIR, "assets", "videos", "outterspace_clock_animation_v2.mp4")
    out_v2_storefront = os.path.join(PROJECT_DIR, "storefront", "assets", "videos", "outterspace_clock_animation_v2.mp4")

    render_animation(words_option_b, out_v2_user, "CABALLO & ALTORO BLACK PANT")
    shutil.copy2(out_v2_user, out_v2_project)
    shutil.copy2(out_v2_user, out_v2_storefront)

    print("\nALL ANIMATIONS GENERATED AND DEPLOYED SUCCESSFULLY!")
