#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

OUT="outputs/demo-v2"
RAW="$OUT/raw"
ASSETS="$OUT/assets"
TTS="$OUT/tts"
FINAL="$OUT/final"
mkdir -p "$RAW" "$ASSETS" "$TTS" "$FINAL"

python3 scripts/demo-v2/generate-assets.py

SCRIPT_TEXT="$TTS/voiceover-script.txt"
cat > "$SCRIPT_TEXT" <<'EOF'
In Web3, risk starts before the wallet popup, when social persuasion becomes an agent task.

SafeIntent captures voice and community context, including urgency, missing proof, and pressure to act.

It compiles plain-language boundaries into payment, approval, wallet, and ask-before rules.

Here, the user wants research only: no signing, unlimited approval, or repeated paid calls.

LoopGuard inspects every planned wallet action, paid tool, MCP call, and repeated loop before execution.

This fake airdrop plan is blocked with risk one hundred and eight explainable conflicts.

SafeIntent returns conflict evidence, a safer rewrite, and an intent-to-action receipt for auditability.

It is registered as OKX.AI ASP Agent five eight four eight, with a public risk-check endpoint.

SafeIntent keeps automation useful without letting it outrun the user's mandate.
EOF

SEGMENTS=(
  "7|In Web3, risk starts before the wallet popup, when social persuasion becomes an agent task."
  "8|SafeIntent captures voice and community context, including urgency, missing proof, and pressure to act."
  "8|It compiles plain-language boundaries into payment, approval, wallet, and ask-before rules."
  "9|Here, the user wants research only: no signing, unlimited approval, or repeated paid calls."
  "10|LoopGuard inspects every planned wallet action, paid tool, MCP call, and repeated loop before execution."
  "9|This fake airdrop plan is blocked with risk one hundred and eight explainable conflicts."
  "9|SafeIntent returns conflict evidence, a safer rewrite, and an intent-to-action receipt for auditability."
  "6|It is registered as OKX.AI ASP Agent five eight four eight, with a public risk-check endpoint."
  "6|SafeIntent keeps automation useful without letting it outrun the user's mandate."
)

VOICE_INPUTS=()
VOICE_FILTER=""
for i in "${!SEGMENTS[@]}"; do
  IFS='|' read -r DURATION TEXT <<< "${SEGMENTS[$i]}"
  NUM="$(printf '%02d' "$((i + 1))")"
  say -v Samantha -r 174 "$TEXT" -o "$TTS/segment-$NUM.aiff"
  ffmpeg -y -hide_banner -loglevel error \
    -i "$TTS/segment-$NUM.aiff" \
    -af "highpass=f=80,lowpass=f=12000,acompressor=threshold=-18dB:ratio=2.5:attack=10:release=120,loudnorm=I=-18:TP=-2:LRA=7,apad=whole_dur=$DURATION,atrim=duration=$DURATION" \
    -ar 48000 -ac 1 "$TTS/segment-$NUM.wav"
  VOICE_INPUTS+=(-i "$TTS/segment-$NUM.wav")
  VOICE_FILTER+="[$i:a]"
done
VOICE_FILTER+="concat=n=9:v=0:a=1[voice]"

ffmpeg -y -hide_banner -loglevel error \
  "${VOICE_INPUTS[@]}" \
  -filter_complex "$VOICE_FILTER" \
  -map "[voice]" -t 72 "$TTS/voiceover.wav"

RAW_VIDEO="${1:-}"
if [[ -z "$RAW_VIDEO" ]]; then
  RAW_VIDEO="$(find "$RAW" -maxdepth 1 -type f \( -name '*.webm' -o -name '*.mp4' \) | sort | tail -n 1 || true)"
fi
if [[ -z "$RAW_VIDEO" || ! -f "$RAW_VIDEO" ]]; then
  echo "No raw demo recording found under $RAW" >&2
  exit 1
fi

ffmpeg -y -hide_banner -loglevel error \
  -loop 1 -t 2.8 -i "$ASSETS/intro.png" \
  -i "$RAW_VIDEO" \
  -loop 1 -t 5.2 -i "$ASSETS/outro.png" \
  -filter_complex "\
    [0:v]fps=25,scale=1440:900,format=yuv420p[intro];\
    [1:v]fps=25,scale=1440:900:force_original_aspect_ratio=decrease,pad=1440:900:(ow-iw)/2:(oh-ih)/2:black,trim=duration=64,setpts=PTS-STARTPTS[demo];\
    [2:v]fps=25,scale=1440:900,format=yuv420p[outro];\
    [intro][demo][outro]concat=n=3:v=1:a=0[base]" \
  -map "[base]" -t 72 -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
  "$FINAL/base.mp4"

FILTER="[0:v]"
INPUTS=(-i "$FINAL/base.mp4")
INDEX=1
for png in "$ASSETS"/subtitles/sub-*.png; do
  INPUTS+=(-i "$png")
done
INPUTS+=(-i "$ASSETS/asp-proof.png")

FILTER+="null[v0];"
CURRENT="v0"
SUB_TIMES=("0:7" "7:15" "15:23" "23:32" "32:42" "42:51" "51:60" "60:66" "66:72")
for i in "${!SUB_TIMES[@]}"; do
  IFS=: read -r START END <<< "${SUB_TIMES[$i]}"
  NEXT="v$((i + 1))"
  FILTER+="[$CURRENT][$((i + 1)):v]overlay=0:0:enable='between(t,$START,$END)'[$NEXT];"
  CURRENT="$NEXT"
done
ASP_INDEX=10
FILTER+="[$CURRENT][$ASP_INDEX:v]overlay=0:0:enable='between(t,60,66)'[video]"

ffmpeg -y -hide_banner -loglevel error \
  "${INPUTS[@]}" \
  -filter_complex "$FILTER" \
  -map "[video]" -an -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
  "$FINAL/video-captioned.mp4"

ffmpeg -y -hide_banner -loglevel error \
  -i "$TTS/voiceover.wav" \
  -i "$ASSETS/safeintent-music-v2.wav" \
  -filter_complex "\
    [1:a]volume=0.42[music];\
    [music][0:a]sidechaincompress=threshold=0.025:ratio=8:attack=15:release=350[ducked];\
    [0:a][ducked]amix=inputs=2:weights='1 0.75':normalize=0,loudnorm=I=-16:TP=-1.2:LRA=8[audio]" \
  -map "[audio]" -t 72 -ar 48000 -ac 2 "$FINAL/mix.wav"

ffmpeg -y -hide_banner -loglevel error \
  -i "$FINAL/video-captioned.mp4" \
  -i "$FINAL/mix.wav" \
  -map 0:v:0 -map 1:a:0 \
  -c:v copy -c:a aac -b:a 192k -movflags +faststart -t 72 \
  "$FINAL/safeintent-loopguard-demo-v2.mp4"

ffmpeg -y -hide_banner -loglevel error \
  -ss 42 -i "$FINAL/safeintent-loopguard-demo-v2.mp4" -frames:v 1 \
  "$FINAL/safeintent-loopguard-demo-v2-cover.jpg"

echo "$FINAL/safeintent-loopguard-demo-v2.mp4"
