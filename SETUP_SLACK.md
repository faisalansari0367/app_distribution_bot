# Step 1: Create Slack Bot

## 1.1 Create Slack App
1. Go to https://api.slack.com/apps
2. Click "Create New App" → "From scratch"
3. App Name: `Firebase App Distribution Bot`
4. Pick your workspace
5. Click "Create App"

## 1.2 Configure Bot Permissions
1. In your app settings, go to "OAuth & Permissions"
2. Scroll to "Scopes" → "Bot Token Scopes"
3. Add these scopes:
   - `chat:write` (Send messages)
   - `chat:write.public` (Post to channels without joining)

## 1.3 Install Bot to Workspace
1. Scroll up to "OAuth Tokens for Your Workspace"
2. Click "Install to Workspace"
3. Review permissions and click "Allow"
4. **Copy the Bot User OAuth Token** (starts with `xoxb-`)

## 1.4 Create #app_distribution Channel
1. In Slack, create a new channel called `#app_distribution`
2. Invite your team members who should see build notifications
3. Add the bot to the channel: `/invite @Firebase App Distribution Bot`

## 1.5 Get Signing Secret
1. Back in Slack app settings, go to "Basic Information"
2. Scroll to "App Credentials"
3. **Copy the Signing Secret**

✅ Save these values:
- Bot Token: `xoxb-...`
- Signing Secret: `abc123...`
