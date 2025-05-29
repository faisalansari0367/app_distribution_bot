#!/bin/bash

# Firebase App Distribution Slack Bot Setup Script

set -e

echo "🚀 Setting up Firebase App Distribution Slack Bot..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please login to Firebase first:"
    firebase login
fi

# Copy environment template if .env doesn't exist
if [ ! -f .env ]; then
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your actual values before proceeding!"
    echo "   Required: SLACK_TOKEN, FIREBASE_PROJECT_ID"
    exit 1
fi

# Source environment variables
source .env

# Validate required environment variables
if [ -z "$SLACK_TOKEN" ] || [ -z "$FIREBASE_PROJECT_ID" ]; then
    echo "❌ Missing required environment variables in .env file"
    echo "   Required: SLACK_TOKEN, FIREBASE_PROJECT_ID"
    exit 1
fi

# Set Firebase project
echo "🔧 Setting Firebase project to: $FIREBASE_PROJECT_ID"
firebase use $FIREBASE_PROJECT_ID

# Set Firebase functions config
echo "⚙️  Setting Firebase functions configuration..."
firebase functions:config:set \
  slack.token="$SLACK_TOKEN" \
  slack.channel="${SLACK_CHANNEL:-#app-releases}" \
  slack.signing_secret="${SLACK_SIGNING_SECRET:-}" \
  app.project_id="$FIREBASE_PROJECT_ID" \
  app.environment="${NODE_ENV:-production}"

# Build the project
echo "🔨 Building TypeScript project..."
npm run build

# Deploy functions
echo "🚀 Deploying to Firebase..."
firebase deploy --only functions

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the function URL from the deployment output"
echo "2. Configure Firebase App Distribution webhook to point to:"
echo "   https://your-region-your-project.cloudfunctions.net/appDistributionBot/webhook/app-distribution"
echo "3. Test the integration with:"
echo "   curl -X POST https://your-function-url/test/notification -d '{\"releaseId\":\"test\",\"platform\":\"android\"}'"
echo ""
echo "🔗 Function URL will be displayed above this message"
