#!/usr/bin/env bash
set -euo pipefail

# run-all.sh — start backend, frontend, optional docker and locust
# Usage: ./run-all.sh [--no-docker] [--no-locust] [--build-frontend]

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$ROOT_DIR/logs"
mkdir -p "$LOG_DIR"

PNPM_CMD=$(command -v pnpm || true)
NPM_CMD=$(command -v npm || true)
DOCKER_CMD=$(command -v docker || true)
LOCUST_CMD=$(command -v locust || true)

NO_DOCKER=0
NO_LOCUST=0
BUILD_FRONTEND=0

usage(){
  cat <<EOF
Usage: $0 [options]

Options:
  --no-docker       Don't start docker-compose (if present)
  --no-locust       Don't start locust tests
  --build-frontend  Run a production build for the frontend before starting
  -h|--help         Show this help

Logs are written to $LOG_DIR (backend.log, frontend.log, docker.log, locust.log).
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-docker) NO_DOCKER=1; shift ;;
    --no-locust) NO_LOCUST=1; shift ;;
    --build-frontend) BUILD_FRONTEND=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1"; usage; exit 1 ;;
  esac
done

# docker-compose (optional)
if [[ $NO_DOCKER -eq 0 && -n "$DOCKER_CMD" && -f "$ROOT_DIR/docker/docker-compose.yml" ]]; then
  echo "Starting docker-compose... (logs: $LOG_DIR/docker.log)"
  (cd "$ROOT_DIR/docker" && docker compose up -d) >"$LOG_DIR/docker.log" 2>&1 || echo "docker compose up failed (see $LOG_DIR/docker.log)"
else
  echo "Skipping docker-compose"
fi

# Build frontend (optional)
if [[ $BUILD_FRONTEND -eq 1 && -n "$NPM_CMD" && -f "$ROOT_DIR/frontend/package.json" ]]; then
  echo "Building frontend (production)..."
  (cd "$ROOT_DIR/frontend" && $NPM_CMD run build) >"$LOG_DIR/frontend-build.log" 2>&1 || echo "frontend build failed (see $LOG_DIR/frontend-build.log)"
fi

# Start backend
if [[ -d "$ROOT_DIR/ms-nosql-ecommerce" ]]; then
  echo "Starting backend (ms-nosql-ecommerce) -> logs: $LOG_DIR/backend.log"
  if [[ -n "$PNPM_CMD" ]]; then
    (cd "$ROOT_DIR/ms-nosql-ecommerce" && $PNPM_CMD run start:dev) >"$LOG_DIR/backend.log" 2>&1 &
  elif [[ -n "$NPM_CMD" ]]; then
    (cd "$ROOT_DIR/ms-nosql-ecommerce" && $NPM_CMD run start:dev) >"$LOG_DIR/backend.log" 2>&1 &
  else
    echo "pnpm/npm not found; cannot start backend" >"$LOG_DIR/backend.log"
  fi
  PID_BACKEND=$!
else
  echo "Backend folder ms-nosql-ecommerce not found. Skipping." >"$LOG_DIR/backend.log"
  PID_BACKEND=""
fi

# Start frontend
if [[ -d "$ROOT_DIR/frontend" ]]; then
  echo "Starting frontend -> logs: $LOG_DIR/frontend.log"
  if [[ -n "$NPM_CMD" ]]; then
    (cd "$ROOT_DIR/frontend" && $NPM_CMD run dev) >"$LOG_DIR/frontend.log" 2>&1 &
  else
    echo "npm not found; cannot start frontend" >"$LOG_DIR/frontend.log"
  fi
  PID_FRONTEND=$!
else
  echo "Frontend folder not found. Skipping." >"$LOG_DIR/frontend.log"
  PID_FRONTEND=""
fi

# Start locust (optional)
if [[ $NO_LOCUST -eq 0 && -n "$LOCUST_CMD" && -f "$ROOT_DIR/ms-nosql-ecommerce/locustfile.py" ]]; then
  echo "Starting locust (headless) -> logs: $LOG_DIR/locust.log"
  (cd "$ROOT_DIR/ms-nosql-ecommerce" && $LOCUST_CMD -f locustfile.py --headless -u 10 -r 2 --run-time 10m --host http://localhost:3000) >"$LOG_DIR/locust.log" 2>&1 &
  PID_LOCUST=$!
else
  echo "Skipping locust"
  PID_LOCUST=""
fi

pids=()
[[ -n "${PID_BACKEND:-}" ]] && pids+=("$PID_BACKEND")
[[ -n "${PID_FRONTEND:-}" ]] && pids+=("$PID_FRONTEND")
[[ -n "${PID_LOCUST:-}" ]] && pids+=("$PID_LOCUST")

cleanup(){
  echo "\nStopping processes..."
  for pid in "${pids[@]}"; do
    if [[ -n "$pid" ]]; then
      echo "Killing PID $pid"; kill "$pid" 2>/dev/null || true
    fi
  done
  if [[ $NO_DOCKER -eq 0 && -n "$DOCKER_CMD" && -f "$ROOT_DIR/docker/docker-compose.yml" ]]; then
    echo "Bringing down docker-compose..."
    (cd "$ROOT_DIR/docker" && docker compose down) >>"$LOG_DIR/docker.log" 2>&1 || true
  fi
  echo "Cleanup done. Logs are in $LOG_DIR"
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

echo "Started services. Logs:"
ls -1 "$LOG_DIR" || true

echo "Press Ctrl+C to stop everything."
while true; do sleep 1; done
