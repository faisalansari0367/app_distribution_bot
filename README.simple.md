# Firebase App Distribution to Slack Bot (Minimal Version)

A simple Firebase Cloud Function that sends notifications to a **single Slack channel** when new builds are uploaded to Firebase App Distribution.

## 🎯 What This Does

- **One Channel**: All notifications go to `#app_distribution` 
- **Everyone Gets Access**: Anyone in the Slack channel can download builds
- **Zero Configuration**: No complex routing or tester management
- **Simple Setup**: Just 2 environment variables needed

## 🚀 Quick Setup (5 minutes)

### 1. Clone & Install
```bash
git clone <your-repo>
cd app_distribution_bot
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your values:
```bash
SLACK_TOKEN=xoxb-your-slack-bot-token-here
SLACK_SIGNING_SECRET=your-slack-signing-secret
```

### 3. Deploy
```bash
npm run deploy
```

### 4. Set Webhook in Firebase Console
- Go to Firebase Console → App Distribution → Integrations
- Add webhook URL: `https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/appDistributionBot/webhook/app-distribution`

## 📱 How It Works

1. Someone uploads a build to Firebase App Distribution
2. Firebase sends webhook to your Cloud Function  
3. Bot posts a nice message to `#app_distribution` with download button
4. Everyone in the channel can click to download

## 🔧 Slack Bot Setup

Create a Slack app with these scopes:
- `chat:write` - Send messages
- `chat:write.public` - Post to channels

## 📝 Message Format

```
🤖 New ANDROID Build Available

App: My Awesome App
Version: 1.2.3 (456)
Platform: ANDROID
Release Date: 5/29/2025, 2:30:15 PM

Release Notes:
• New awesome feature
• Bug fixes

[📱 Download App]

📱 Installation: Click the download button above. The app is available to everyone in this channel.
```

## 🧪 Testing

Test the bot:
```bash
npm run test
```

Send a test notification:
```bash
curl -X POST https://YOUR_FUNCTION_URL/test/notification \
  -H "Content-Type: application/json" \
  -d '{"releaseId":"test123","platform":"android"}'
```

## 📂 Project Structure

```
src/
├── index.ts                 # Main Cloud Function
├── config/simple.ts         # Minimal config (just Slack token)
├── services/slackService.ts # Send messages to #app_distribution
├── handlers/webhookHandler.ts # Process Firebase webhooks
└── types/index.ts          # TypeScript interfaces
```

## 🤝 Contributing

This is the **minimal version** focused on simplicity:
- One channel: `#app_distribution`
- No complex routing
- No tester management  
- No environment-specific channels

For advanced features, see the full version.
