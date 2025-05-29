# 🚀 Complete Setup Guide: Firebase "poker" Project → Slack

## Overview
This bot will send notifications to `#app_distribution` when you upload builds to Firebase App Distribution for your poker project.

---

## 📋 **STEP 1: Create Slack Bot** (5 minutes)

### 1.1 Create App
1. Go to https://api.slack.com/apps
2. "Create New App" → "From scratch" 
3. Name: `Firebase App Distribution Bot`
4. Select your workspace → "Create App"

### 1.2 Set Permissions
1. Go to "OAuth & Permissions"
2. Add Bot Token Scopes:
   - `chat:write`
   - `chat:write.public`

### 1.3 Install to Workspace
1. Click "Install to Workspace" → "Allow"
2. **Copy the Bot User OAuth Token** (starts with `xoxb-`)

### 1.4 Get Signing Secret
1. Go to "Basic Information" → "App Credentials"
2. **Copy the Signing Secret**

### 1.5 Create Channel
1. In Slack, create `#app_distribution` channel
2. Invite team members
3. Add bot: `/invite @Firebase App Distribution Bot`

---

## ⚙️ **STEP 2: Configure Your Bot** (2 minutes)

### 2.1 Set Environment Variables
```bash
cd /Users/mohd.faisal/app_distribution_bot
cp .env.example .env
```

Edit `.env` file:
```bash
SLACK_TOKEN=xoxb-your-actual-token-here
SLACK_SIGNING_SECRET=your-actual-signing-secret-here
```

### 2.2 Connect to Firebase Project
```bash
firebase use --add
```
- Select your "poker" project
- Give it alias "poker" or "default"

---

## 🚀 **STEP 3: Deploy to Firebase** (3 minutes)

### 3.1 Deploy
```bash
npm run deploy
```

### 3.2 Copy the Function URL
You'll see output like:
```
Function URL: https://us-central1-poker-abc123.cloudfunctions.net/appDistributionBot
```
**Save this URL!**

---

## 🔗 **STEP 4: Configure Webhook** (2 minutes)

### 4.1 Go to Firebase Console
1. Open https://console.firebase.google.com/
2. Select your **"poker"** project
3. Go to "App Distribution" → "Integrations"

### 4.2 Add Webhook
1. Click "Add webhook"
2. **Webhook URL**: `YOUR_FUNCTION_URL/webhook/app-distribution`
   
   Example: `https://us-central1-poker-abc123.cloudfunctions.net/appDistributionBot/webhook/app-distribution`

3. **Events**: Select "Release created" and "Release updated"
4. Click "Save"

---

## 🧪 **STEP 5: Test It** (1 minute)

### 5.1 Upload a Build
1. Go to Firebase Console → App Distribution
2. Upload your poker app (APK/IPA)
3. Add testers and distribute

### 5.2 Check Slack
You should see a message in `#app_distribution` like:

```
🤖 New ANDROID Build Available

App: Poker Game
Version: 1.0.0 (123)
Platform: ANDROID
Release Date: 5/29/2025, 5:30:15 PM

[📱 Download App]

📱 Installation: Click the download button above. 
The app is available to everyone in this channel.
```

---

## ✅ **You're Done!**

Now whenever you upload a build to Firebase App Distribution for your poker project:
1. Firebase sends webhook to your Cloud Function
2. Bot posts notification to `#app_distribution` 
3. Everyone in channel can download

## 🆘 **Troubleshooting**

**No Slack message?**
```bash
# Check function logs
firebase functions:log --only appDistributionBot

# Test manually
curl -X POST "YOUR_FUNCTION_URL/test/notification" \
  -H "Content-Type: application/json" \
  -d '{"releaseId":"test123","platform":"android"}'
```

**Bot can't post to channel?**
- Make sure bot is added to `#app_distribution` channel
- Check bot permissions include `chat:write` and `chat:write.public`

**Function won't deploy?**
- Ensure you're connected to the right Firebase project: `firebase use poker`
- Check `.env` file has correct Slack tokens
