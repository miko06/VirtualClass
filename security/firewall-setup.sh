#!/bin/sh
set -eu

if ! command -v ufw >/dev/null 2>&1; then
  echo "ufw не установлен. Установите ufw и повторите."
  exit 1
fi

ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# SSH (контейнерный порт)
ufw allow 2222/tcp

# Web
ufw allow 80/tcp
ufw allow 443/tcp

ufw --force enable
ufw status verbose

