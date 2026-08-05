#!/bin/bash
# File: /home/ML/spotter-assessment/spotter-webapp/frontend/start-frontend.sh

cd /home/ML/spotter-assessment/spotter-webapp/frontend

echo "🧹 Cleaning Next.js caches to prevent UI bugs..."
rm -rf .next node_modules/.cache

echo "🔨 Building production bundle..."
npm run build

echo "🔍 Finding a free port starting from 3000..."
PORT=3000
while ss -tuln 2>/dev/null | grep -q ":$PORT "; do
    PORT=$((PORT + 1))
done

echo "✅ Selected free port: $PORT"
# Save the port to a file so you always know where to go
echo "http://127.0.0.1:$PORT" > /home/ML/spotter-assessment/spotter-webapp/frontend-url.txt

echo "🚀 Starting Next.js server on port $PORT..."
# 'exec' replaces the shell process with next.js, allowing systemd to track it properly
exec npx next start -p $PORT