#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="$ROOT_DIR/backups"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_FILE="$BACKUP_DIR/central_db-$TIMESTAMP.sql"
APP_PID=""

cd "$ROOT_DIR"
mkdir -p "$BACKUP_DIR"

cleanup() {
  exit_code=$?
  trap - EXIT INT TERM

  echo
  echo "Guardando datos de PostgreSQL..."
  if docker exec central_postgres pg_dump -U postgres -d central_db > "$BACKUP_FILE"; then
    echo "Copia guardada en: $BACKUP_FILE"
  else
    echo "No se pudo crear la copia de seguridad." >&2
  fi

  if [[ -n "$APP_PID" ]] && kill -0 "$APP_PID" 2>/dev/null; then
    kill "$APP_PID" 2>/dev/null || true
    wait "$APP_PID" 2>/dev/null || true
  fi

  echo "La base permanece en Docker. No se borró ningún volumen."
  exit "$exit_code"
}

trap cleanup EXIT INT TERM

echo "Iniciando PostgreSQL local..."
docker compose up -d postgres

until docker exec central_postgres pg_isready -U postgres -d central_db >/dev/null 2>&1; do
  printf '.'
  sleep 1
done
printf '\n'

echo "Iniciando aplicación en http://localhost:3000"
npm run dev &
APP_PID=$!
wait "$APP_PID"
