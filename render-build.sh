#!/usr/bin/env bash
# Render build script for BookEase
# Installs dependencies for both backend and frontend, then builds frontend

set -e

echo "=== Installing backend dependencies ==="
cd backend
npm install --production

echo "=== Installing frontend dependencies ==="
cd ../frontend
npm install --include=dev

echo "=== Building frontend ==="
npx vite build

echo "=== Build complete ==="
