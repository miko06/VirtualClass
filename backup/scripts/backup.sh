#!/bin/sh
set -eu

POSTGRES_DB="${POSTGRES_DB:-vc}"
POSTGRES_USER="${POSTGRES_USER:-vc}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-vc}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"
BACKUP_INTERVAL_SECONDS="${BACKUP_INTERVAL_SECONDS:-86400}"

export PGPASSWORD="$POSTGRES_PASSWORD"

mkdir -p /backups

echo "[backup] service started: db=${POSTGRES_DB}, retention=${BACKUP_RETENTION_DAYS}d, interval=${BACKUP_INTERVAL_SECONDS}s"

while true; do
  ts="$(date +%Y%m%d_%H%M%S)"
  out="/backups/${POSTGRES_DB}_${ts}.dump"

  if pg_dump -h postgres -U "$POSTGRES_USER" -d "$POSTGRES_DB" -F c -f "$out"; then
    echo "[backup] created $out"
  else
    echo "[backup] failed to create dump"
  fi

  find /backups -type f -name "*.dump" -mtime +"$BACKUP_RETENTION_DAYS" -delete
  sleep "$BACKUP_INTERVAL_SECONDS"
done

