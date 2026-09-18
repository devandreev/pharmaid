#!/bin/bash
set -e

usage() {
  echo "Usage: $0 <input> [output] [options]"
  echo ""
  echo "Options:"
  echo "  -s, --size WxH     Output resolution (default: same as input)"
  echo "  -q, --quality N    CRF quality 18-28 (default: 23, lower = better)"
  echo "  -p, --preset P     x264 preset: ultrafast/medium/veryslow (default: medium)"
  echo "  -a, --audio N      Audio bitrate in kbps (default: 128)"
  echo "  -r, --rate N       Output framerate (default: input framerate)"
  echo "  -h, --help         Show this help"
  echo ""
  echo "Examples:"
  echo "  $0 input.mov"
  echo "  $0 input.mov output.mp4 -s 1280x720 -q 20"
  exit 0
}

INPUT=""
OUTPUT=""
SIZE=""
QUALITY=23
PRESET="medium"
AUDIO_BR=128
FPS=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    -s|--size) SIZE="${2//×/:}"; SIZE="${SIZE//x/:}"; shift 2 ;;
    -q|--quality) QUALITY="$2"; shift 2 ;;
    -p|--preset) PRESET="$2"; shift 2 ;;
    -a|--audio) AUDIO_BR="$2"; shift 2 ;;
    -r|--rate) FPS="-r $2"; shift 2 ;;
    -h|--help) usage ;;
    -*)
      if [[ -z "$INPUT" ]]; then
        echo "Unknown option: $1"; exit 1
      fi
      break
      ;;
    *)
      if [[ -z "$INPUT" ]]; then
        INPUT="$1"
      elif [[ -z "$OUTPUT" ]]; then
        OUTPUT="$1"
      else
        echo "Unexpected argument: $1"; exit 1
      fi
      shift
      ;;
  esac
done

if [[ -z "$INPUT" ]]; then
  echo "Error: input file required"
  usage
fi

if [[ ! -f "$INPUT" ]]; then
  echo "Error: file not found: $INPUT"
  exit 1
fi

BASENAME="${INPUT%.*}"
OUTPUT="${OUTPUT:-${BASENAME}.mp4}"

if [[ -n "$SIZE" ]]; then
  FILTER="scale=${SIZE}:force_original_aspect_ratio=decrease,pad=${SIZE/:/:}:(ow-iw)/2:(oh-ih)/2"
  VF="-vf $FILTER"
else
  VF=""
fi

ffmpeg -i "$INPUT" \
  -c:v libx264 \
  -crf "$QUALITY" \
  -preset "$PRESET" \
  $VF \
  $FPS \
  -c:a aac \
  -b:a "${AUDIO_BR}k" \
  -movflags +faststart \
  "$OUTPUT"

echo ""
echo "Done: $INPUT -> $OUTPUT"
