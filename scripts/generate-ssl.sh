#!/bin/bash
set -e

SSL_DIR="$(dirname "$0")/../nginx/ssl"
mkdir -p "$SSL_DIR"

CN="${1:-localhost}"

cat > "$SSL_DIR/server.cnf" <<EOF
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = v3_req

[dn]
C=KZ
ST=Astana
L=Astana
O=ENU
CN=$CN

[v3_req]
subjectAltName = @alt_names

[alt_names]
IP.1 = $CN
DNS.1 = $CN
DNS.2 = localhost
EOF

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$SSL_DIR/server.key" \
  -out "$SSL_DIR/server.crt" \
  -config "$SSL_DIR/server.cnf" \
  -extensions v3_req

rm -f "$SSL_DIR/server.cnf"

chmod 600 "$SSL_DIR/server.key"
chmod 644 "$SSL_DIR/server.crt"

echo "SSL certificate generated in $SSL_DIR"
echo "  CN: $CN"
echo "  server.key  (private key)"
echo "  server.crt  (certificate)"
