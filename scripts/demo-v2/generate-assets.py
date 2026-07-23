#!/usr/bin/env python3

from __future__ import annotations

import math
import os
import struct
import wave
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "outputs" / "demo-v2"
ASSETS = OUT / "assets"
TTS = OUT / "tts"

WIDTH = 1440
HEIGHT = 900
DURATION = 72.0
SAMPLE_RATE = 48000
BPM = 100

SUBTITLES = [
    (0.0, 7.0, "Risk starts before the wallet popup."),
    (7.0, 15.0, "Capture urgency, persuasion, and missing proof."),
    (15.0, 23.0, "Turn user boundaries into execution policy."),
    (23.0, 32.0, "Preserve the user's real intent."),
    (32.0, 42.0, "Inspect every step before execution."),
    (42.0, 51.0, "BLOCK: risk 100, eight conflicts."),
    (51.0, 60.0, "Evidence, safer rewrite, and receipt."),
    (60.0, 66.0, "Registered OKX.AI ASP Agent 5848."),
    (66.0, 72.0, "Automation that stays inside the mandate."),
]

CUES = [7.0, 15.0, 23.0, 32.0, 42.0, 51.0, 60.0, 66.0]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        "/System/Library/Fonts/SFNS.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
    ]
    if bold:
        candidates.insert(0, "/System/Library/Fonts/SFNSDisplay-Bold.otf")
    for candidate in candidates:
        if os.path.exists(candidate):
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def centered_text(draw: ImageDraw.ImageDraw, text: str, y: int, text_font: ImageFont.FreeTypeFont, fill: tuple[int, ...]):
    box = draw.textbbox((0, 0), text, font=text_font)
    x = (WIDTH - (box[2] - box[0])) // 2
    draw.text((x, y), text, font=text_font, fill=fill)


def make_intro():
    image = Image.new("RGBA", (WIDTH, HEIGHT), (4, 8, 18, 255))
    draw = ImageDraw.Draw(image)
    for y in range(HEIGHT):
        t = y / HEIGHT
        draw.line((0, y, WIDTH, y), fill=(4, int(12 + 12 * t), int(24 + 28 * t), 255))
    for radius, alpha in [(280, 22), (190, 30), (100, 44)]:
        draw.ellipse(
            (WIDTH // 2 - radius, HEIGHT // 2 - radius, WIDTH // 2 + radius, HEIGHT // 2 + radius),
            outline=(19, 221, 255, alpha),
            width=2,
        )
    centered_text(draw, "SAFEINTENT", 310, font(74, True), (235, 250, 255, 255))
    centered_text(draw, "LOOPGUARD", 392, font(74, True), (127, 232, 255, 255))
    centered_text(draw, "PRE-EXECUTION RISK FIREWALL", 505, font(24), (175, 189, 210, 255))
    image.save(ASSETS / "intro.png")


def make_asp_card():
    image = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    left, top, right, bottom = 180, 210, 1260, 690
    draw.rounded_rectangle((left, top, right, bottom), radius=8, fill=(6, 12, 25, 238), outline=(28, 221, 255, 210), width=2)
    draw.rectangle((left, top, left + 10, bottom), fill=(28, 221, 255, 255))
    draw.text((235, 255), "OKX.AI ASP", font=font(24, True), fill=(122, 231, 255, 255))
    draw.text((235, 312), "SafeIntent LoopGuard", font=font(50, True), fill=(245, 250, 255, 255))
    draw.text((235, 405), "AGENT ID", font=font(20, True), fill=(145, 159, 183, 255))
    draw.text((235, 442), "5848", font=font(74, True), fill=(255, 196, 92, 255))
    draw.text((580, 405), "PUBLIC SERVICE", font=font(20, True), fill=(145, 159, 183, 255))
    draw.text((580, 448), "Pre-Execution Risk Check", font=font(32, True), fill=(225, 238, 248, 255))
    draw.text((580, 510), "safeintent-loopguard.pages.dev/api/guard/check", font=font(21), fill=(122, 231, 255, 255))
    draw.text((235, 610), "Registered identity  •  X Layer  •  Explainable guard decisions", font=font(22), fill=(166, 178, 197, 255))
    image.save(ASSETS / "asp-proof.png")


def make_outro():
    image = Image.new("RGBA", (WIDTH, HEIGHT), (4, 8, 18, 255))
    draw = ImageDraw.Draw(image)
    for x in range(0, WIDTH, 36):
        draw.line((x, 0, x, HEIGHT), fill=(20, 68, 90, 35), width=1)
    for y in range(0, HEIGHT, 36):
        draw.line((0, y, WIDTH, y), fill=(20, 68, 90, 30), width=1)
    centered_text(draw, "SAFEINTENT LOOPGUARD", 290, font(66, True), (235, 250, 255, 255))
    centered_text(draw, "Automation that stays inside the mandate.", 405, font(34), (122, 231, 255, 255))
    centered_text(draw, "OKX.AI ASP  •  AGENT 5848", 520, font(22, True), (255, 196, 92, 255))
    image.save(ASSETS / "outro.png")


def make_subtitles():
    subtitle_dir = ASSETS / "subtitles"
    subtitle_dir.mkdir(parents=True, exist_ok=True)
    srt_lines = []
    for index, (start, end, text) in enumerate(SUBTITLES, start=1):
        image = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        draw = ImageDraw.Draw(image)
        text_font = font(34, True)
        box = draw.textbbox((0, 0), text, font=text_font)
        text_width = box[2] - box[0]
        bar_width = min(WIDTH - 160, text_width + 100)
        left = (WIDTH - bar_width) // 2
        top = 785
        draw.rounded_rectangle((left, top, left + bar_width, 852), radius=6, fill=(2, 7, 15, 224), outline=(66, 94, 118, 185), width=1)
        centered_text(draw, text, 798, text_font, (245, 250, 255, 255))
        image.save(subtitle_dir / f"sub-{index:02d}.png")
        srt_lines.extend([str(index), f"{stamp(start)} --> {stamp(end)}", text, ""])
    (TTS / "safeintent-loopguard-demo-v2.srt").write_text("\n".join(srt_lines), encoding="utf-8")


def stamp(seconds: float) -> str:
    total_ms = round(seconds * 1000)
    hours, total_ms = divmod(total_ms, 3_600_000)
    minutes, total_ms = divmod(total_ms, 60_000)
    secs, millis = divmod(total_ms, 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


def envelope(t: float, start: float, duration: float, attack: float = 0.02, release: float = 0.2) -> float:
    local = t - start
    if local < 0 or local > duration:
        return 0.0
    return min(1.0, local / attack) * min(1.0, (duration - local) / release)


def make_music():
    frames = bytearray()
    beat = 60.0 / BPM
    for sample in range(int(DURATION * SAMPLE_RATE)):
        t = sample / SAMPLE_RATE
        phrase = int(t // (beat * 8))
        chord_roots = [55.0, 65.406, 48.999, 73.416]
        root = chord_roots[phrase % len(chord_roots)]

        pulse_phase = (t % beat) / beat
        pulse_env = math.exp(-pulse_phase * 7.0)
        bass = math.sin(2 * math.pi * root * t) * pulse_env * 0.12

        pad = (
            math.sin(2 * math.pi * root * 2.0 * t)
            + 0.55 * math.sin(2 * math.pi * root * 3.0 * t + 0.6)
            + 0.35 * math.sin(2 * math.pi * root * 4.0 * t + 1.1)
        ) * 0.035

        tick_phase = (t % (beat / 2)) / (beat / 2)
        tick = math.sin(2 * math.pi * 1400 * t) * math.exp(-tick_phase * 34.0) * (0.012 if t >= 23 else 0.0)

        hit = 0.0
        for cue_index, cue in enumerate(CUES):
            env = envelope(t, cue, 0.55, attack=0.005, release=0.5)
            hit += (
                math.sin(2 * math.pi * (240 + cue_index * 18) * (t - cue))
                + 0.55 * math.sin(2 * math.pi * (480 + cue_index * 11) * (t - cue))
            ) * env * 0.06

        if 41.82 <= t <= 42.10:
            bass *= 0.08
            pad *= 0.12
            tick *= 0.0

        fade = min(1.0, t / 2.0) * min(1.0, (DURATION - t) / 3.0)
        left = (bass + pad + tick + hit) * fade
        right = (bass + pad * 0.93 + tick * 0.65 + hit * 1.05) * fade
        left_i = max(-32767, min(32767, int(left * 32767)))
        right_i = max(-32767, min(32767, int(right * 32767)))
        frames.extend(struct.pack("<hh", left_i, right_i))

    with wave.open(str(ASSETS / "safeintent-music-v2.wav"), "wb") as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        wav.writeframes(frames)


def main():
    ASSETS.mkdir(parents=True, exist_ok=True)
    TTS.mkdir(parents=True, exist_ok=True)
    make_intro()
    make_asp_card()
    make_outro()
    make_subtitles()
    make_music()
    print(f"Generated demo assets under {OUT}")


if __name__ == "__main__":
    main()
