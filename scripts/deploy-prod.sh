#!/bin/bash
set -e

echo "[deploy] Starting production deployment..."

if [ ! -f .env ]; then
  echo "[deploy] ERROR: .env file not found. Copy .env.example and fill in the values."
  exit 1
fi

echo "[deploy] Building and restarting containers..."
docker compose pull --quiet || true
docker compose up -d --build --remove-orphans

echo "[deploy] Waiting for health check..."
sleep 5

if docker compose ps | grep -q "unhealthy\|Exit"; then
  echo "[deploy] ERROR: One or more containers are unhealthy. Check logs:"
  docker compose logs --tail=50
  exit 1
fi

echo "[deploy] Cleaning up unused Docker resources..."
docker image prune -f

echo "[deploy] Deployment complete."
