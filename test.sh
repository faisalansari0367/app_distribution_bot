#!/bin/bash

# Test script for Firebase App Distribution Slack Bot

set -e

echo "🧪 Testing Firebase App Distribution Slack Bot..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

# Source environment variables
source .env

# Check required environment variables
if [ -z "$SLACK_TOKEN" ] || [ -z "$FIREBASE_PROJECT_ID" ]; then
    echo "❌ Missing required environment variables in .env file"
    echo "   Required: SLACK_TOKEN, FIREBASE_PROJECT_ID"
    exit 1
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Test with Firebase emulators
echo "🚀 Starting Firebase emulators..."
npm run serve &
EMULATOR_PID=$!

# Wait for emulator to start
sleep 5

# Test health endpoint
echo "🏥 Testing health endpoint..."
curl -X GET http://localhost:5001/$FIREBASE_PROJECT_ID/us-central1/appDistributionBot/health

echo ""

# Test notification endpoint
echo "📱 Testing notification endpoint..."
curl -X POST http://localhost:5001/$FIREBASE_PROJECT_ID/us-central1/appDistributionBot/test/notification \
  -H "Content-Type: application/json" \
  -d '{
    "releaseId": "test-release-123",
    "platform": "android"
  }'

echo ""

# Clean up
echo "🧹 Cleaning up..."
kill $EMULATOR_PID

echo "✅ Tests completed!"
echo ""
echo "If tests passed, you can deploy with: ./deploy.sh"
