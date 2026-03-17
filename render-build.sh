#!/usr/bin/env bash
# Render build script for BookEase
# Installs dependencies for both backend and frontend, then builds frontend

set -e

echo "=== Installing backend dependencies ==="
cd backend
npm install

echo "=== Installing frontend dependencies ==="
cd ../frontend
npm install

echo "=== Building frontend ==="
npm run build

echo "=== Build complete ==="
