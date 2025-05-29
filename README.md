# Firebase App Distribution to Slack Bot

Automated bot that distributes Firebase App Distribution builds to Slack channels.

## Architecture

```
Firebase App Distribution → Cloud Function → Slack Bot
```

## Features

- 🚀 Automatic detection of new builds via webhooks
- 📱 Support for Android & iOS builds
- 🔐 Automatic tester permission management
- 📢 Rich Slack notifications with build metadata
- 🌍 Multi-environment support
- 📊 Comprehensive logging and error handling

## Setup

### Prerequisites

1. Firebase project with App Distribution enabled
2. Slack workspace with bot permissions
3. Node.js 18+ and Firebase CLI

### Installation

1. Clone and install dependencies:
```bash
npm install
```

2. Configure Firebase:
```bash
firebase login
firebase use your-project-id
```

3. Set environment variables:
```bash
firebase functions:config:set slack.token="xoxb-your-slack-bot-token"
firebase functions:config:set slack.channel="#your-channel"
firebase functions:config:set app.project_id="your-firebase-project-id"
```

### Deployment

```bash
npm run deploy
```

## Configuration

Update `src/config/environments.ts` with your specific settings:

- Firebase project details
- Slack channel configurations
- Tester group mappings
- Environment-specific settings

## Usage

Once deployed, the bot will automatically:

1. Listen for Firebase App Distribution webhooks
2. Fetch build metadata and download links
3. Manage tester permissions
4. Post formatted messages to Slack

## Development

```bash
# Local development
npm run dev

# Run emulators
npm run serve

# Run tests
npm test
```

## Message Format

The bot posts rich Slack messages with:
- Platform (Android/iOS)
- App name & version
- Build number & release date
- Download link (with proper permissions)
- Release notes
- Direct install links for mobile devices

## Security

- Webhook signature verification
- Secure token management via Firebase config
- CORS protection
- Rate limiting
- Input validation
