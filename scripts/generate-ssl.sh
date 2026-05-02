#!/bin/bash
set -e

SSL_DIR="$(dirname "$0")/../nginx/ssl"
mkdir -p "$SSL_DIR"

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$SSL_DIR/server.key" \
  -out "$SSL_DIR/server.crt" \
  -subj "/C=KZ/ST=Astana/L=Astana/O=ENU/CN=localhost"

chmod 600 "$SSL_DIR/server.key"
chmod 644 "$SSL_DIR/server.crt"

echo "Self-signed certificate generated in $SSL_DIR"
echo "  server.key  (private key)"
echo "  server.crt  (certificate)"
