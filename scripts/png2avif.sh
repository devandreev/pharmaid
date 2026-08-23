#!/usr/bin/env zsh

set -uo pipefail

APP=$(basename "$0")

usage() {
  cat <<EOF
Конвертирует все PNG в AVIF рекурсивно, сохраняя структуру папок.

Usage: $APP -i DIR [-o DIR] [-q NUM] [-s NUM] [-d] [-n]

Options:
  -i DIR   Входная директория (обязательно)
  -o DIR   Выходная директория (по умолчанию: ./avif)
  -q NUM   Качество 0-100 (по умолчанию: 80)
  -s NUM   Скорость кодирования 0-10 (по умолчанию: 6, чем выше тем быстрее)
  -d       Удалять исходные PNG после конвертации
  -n       Dry-run: только показать что будет сделано
  -h       Показать эту справку

Примеры:
  $APP -i ./photos
  $APP -i ./photos -o ./optimized -q 85 -s 4
  $APP -i ./photos -d -n
EOF
  exit 0
}

IN_DIR=""
OUT_DIR=""
QUALITY=80
SPEED=6
DELETE=false
DRY_RUN=false

while getopts ":i:o:q:s:dnh" opt; do
  case $opt in
    i) IN_DIR=$(realpath "$OPTARG") ;;
    o) mkdir -p "$OPTARG" && OUT_DIR=$(realpath "$OPTARG") ;;
    q) QUALITY=$OPTARG ;;
    s) SPEED=$OPTARG ;;
    d) DELETE=true ;;
    n) DRY_RUN=true ;;
    h) usage ;;
    \?) echo "Неизвестный флаг: -$OPTARG" >&2; exit 1 ;;
    :) echo "Флаг -$OPTARG требует аргумент" >&2; exit 1 ;;
  esac
done

if [[ -z "$IN_DIR" ]]; then
  echo "Ошибка: укажите входную директорию через -i" >&2
  exit 1
fi

if [[ ! -d "$IN_DIR" ]]; then
  echo "Ошибка: директория '$IN_DIR' не найдена" >&2
  exit 1
fi

if [[ -z "$OUT_DIR" ]]; then
  OUT_DIR="${IN_DIR:h}/avif"
fi

# Проверка avifenc
if ! command -v avifenc &>/dev/null; then
  echo "Ошибка: avifenc не найден. Установи: brew install libavif" >&2
  exit 1
fi

TEMP_FILE=$(mktemp)
find "$IN_DIR" -type f -iname '*.png' -print0 >"$TEMP_FILE"
TOTAL=0
while IFS= read -r -d '' _; do
  TOTAL=$((TOTAL + 1))
done <"$TEMP_FILE"

if [[ $TOTAL -eq 0 ]]; then
  echo "PNG не найдены в '$IN_DIR'"
  rm -f "$TEMP_FILE"
  exit 0
fi

echo "Найдено PNG: $TOTAL"
echo "Вход:   $IN_DIR"
echo "Выход:  $OUT_DIR"
echo "Качество: $QUALITY | Скорость: $SPEED $([[ $DELETE == true ]] && echo '| Удалять исходники: да')"
echo "---"

COUNT=0

while IFS= read -r -d '' src; do
  rel="${src#$IN_DIR/}"
  dst="$OUT_DIR/${rel%.png}.avif"

  if [[ $DRY_RUN == true ]]; then
    echo "[DRY-RUN] $src → $dst"
    continue
  fi

  mkdir -p "$(dirname "$dst")"

  if ! file --mime-type "$src" | grep -q 'image/png'; then
    echo -e "\n[SKIP] Не PNG: $src"
    continue
  fi

  printf "\rПрогресс: %d/%d" "$COUNT" "$TOTAL"

  if avifenc -q "$QUALITY" --speed "$SPEED" -s 4 "$src" "$dst"; then
    [[ $DELETE == true ]] && rm "$src"
    COUNT=$((COUNT + 1))
  else
    echo -e "\n[ERROR] Не удалось конвертировать: $src" >&2
  fi
done <"$TEMP_FILE"
rm -f "$TEMP_FILE"

echo
echo "Готово! Обработано: $COUNT"
