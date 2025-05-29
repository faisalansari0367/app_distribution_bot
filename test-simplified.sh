#!/bin/bash

# Test script for Firebase App Distribution Slack Bot

echo "🧪 Testing Firebase App Distribution Slack Bot"
echo "============================================="

# Build the project
echo "📦 Building project..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# Run tests
echo "🔬 Running tests..."
npm test
if [ $? -eq 0 ]; then
    echo "✅ All tests passed"
else
    echo "❌ Tests failed"
    exit 1
fi

echo ""
echo "🎉 All checks passed!"
echo ""
echo "🚀 Next steps:"
echo "  1. Set up your .env file with SLACK_TOKEN and SLACK_SIGNING_SECRET"
echo "  2. Deploy: npm run deploy"
echo "  3. Configure webhook in Firebase Console"
echo ""
echo "📝 The bot will send all notifications to #app_distribution channel"
echo "🔓 Everyone in the channel will be able to download builds"
