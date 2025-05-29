# Quick Start Guide

Get your Firebase App Distribution Slack Bot up and running in 15 minutes!

## Prerequisites

- ✅ Firebase project with App Distribution enabled
- ✅ Slack workspace with admin permissions
- ✅ Node.js 18+ installed
- ✅ Firebase CLI installed (`npm install -g firebase-tools`)

## Step 1: Clone and Setup

```bash
# Navigate to your project directory
cd app_distribution_bot

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

## Step 2: Create Slack Bot

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Click **"Create New App"** → **"From scratch"**
3. Name: `App Distribution Bot`
4. Add these OAuth scopes:
   - `chat:write`
   - `chat:write.public`
   - `channels:read`
5. Install to workspace
6. Copy the **Bot User OAuth Token** (starts with `xoxb-`)

## Step 3: Configure Environment

Edit `.env` file:

```env
SLACK_TOKEN=xoxb-your-copied-token-here
SLACK_CHANNEL=#app-releases
FIREBASE_PROJECT_ID=your-firebase-project-id
NODE_ENV=production
```

## Step 4: Deploy to Firebase

```bash
# Login to Firebase
firebase login

# Set your project
firebase use your-project-id

# Deploy the bot
./deploy.sh
```

## Step 5: Configure Webhook

After deployment, copy the function URL and set up the webhook:

```bash
firebase appDistribution:webhook:add \
  --url="https://your-region-your-project.cloudfunctions.net/appDistributionBot/webhook/app-distribution" \
  --events="appDistribution.release.created,appDistribution.release.updated"
```

## Step 6: Test the Setup

```bash
# Test the bot
curl -X POST https://your-function-url/test/notification \
  -H "Content-Type: application/json" \
  -d '{"releaseId":"test","platform":"android"}'
```

## Step 7: Upload a Test Build

Upload a build to Firebase App Distribution and watch the magic happen! 🎉

The bot will automatically:
- ✅ Detect the new build
- ✅ Add configured testers
- ✅ Post a rich message to Slack with download links

## Troubleshooting

### Bot not responding?
- Check Slack token is correct: `firebase functions:config:get`
- Verify bot is in the channel: `/invite @App Distribution Bot`
- Check function logs: `firebase functions:log`

### Webhook not triggering?
- Verify webhook URL is correct
- Check Firebase project permissions
- Test with manual curl command

### Need help?
- Check the logs: `npm run logs`
- Review documentation in `/docs`
- Test locally: `npm run serve`

## What's Next?

🔧 **Customize your bot:**
- Configure tester groups in Firestore
- Customize Slack message format
- Add environment-specific channels

📊 **Monitor your deployment:**
- Set up Firebase monitoring
- Configure error alerting
- Review bot usage analytics

🚀 **Advanced features:**
- Multi-environment support
- Custom approval workflows
- Integration with CI/CD pipelines

---

**🎉 Congratulations!** Your Firebase App Distribution builds will now automatically appear in Slack with download links and release notes.
