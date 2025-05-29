# Slack Bot Setup Guide

This guide walks you through setting up a Slack bot for Firebase App Distribution notifications.

## Step 1: Create a Slack App

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Click **"Create New App"**
3. Choose **"From scratch"**
4. Give your app a name: `App Distribution Bot`
5. Select your workspace

## Step 2: Configure Bot Permissions

### OAuth & Permissions

Navigate to **OAuth & Permissions** in the sidebar and add these Bot Token Scopes:

**Required Scopes:**
- `chat:write` - Send messages to channels
- `chat:write.public` - Send messages to channels the bot isn't a member of
- `channels:read` - View basic information about public channels
- `groups:read` - View basic information about private channels
- `im:read` - View basic information about direct messages
- `mpim:read` - View basic information about group direct messages

**Optional (for enhanced features):**
- `files:write` - Upload files (for logs/screenshots)
- `users:read` - Read user information
- `channels:history` - View messages in public channels
- `reactions:write` - Add emoji reactions

## Step 3: Install App to Workspace

1. In the **OAuth & Permissions** section, click **"Install to Workspace"**
2. Review permissions and click **"Allow"**
3. Copy the **Bot User OAuth Token** (starts with `xoxb-`)
4. Save this token securely - you'll need it for the Firebase function

## Step 4: Configure App Settings

### App Home

1. Go to **App Home** in the sidebar
2. Enable **"Messages Tab"**
3. Check **"Allow users to send Slash commands and messages from the messages tab"**

### Display Information

1. Go to **Basic Information**
2. Add an app icon (optional)
3. Add a description: `Automated notifications for Firebase App Distribution builds`

## Step 5: Add Bot to Channels

1. Go to your desired Slack channel (e.g., `#app-releases`)
2. Type `/invite @App Distribution Bot`
3. Or mention the bot: `@App Distribution Bot`

## Step 6: Get Required Information

You'll need these values for your Firebase function configuration:

### Bot Token
- Location: **OAuth & Permissions** → **Bot User OAuth Token**
- Format: `xoxb-xxxxxxxxxxxxx-xxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx`
- Usage: Set as `SLACK_TOKEN` environment variable

### Channel ID or Name
- Use channel name with `#` prefix: `#app-releases`
- Or get channel ID from Slack URL or API

### Signing Secret (Optional - for webhook verification)
- Location: **Basic Information** → **App Credentials** → **Signing Secret**
- Usage: Set as `SLACK_SIGNING_SECRET` for webhook verification

## Step 7: Test the Bot

### Manual Test

Test if the bot can send messages:

```bash
curl -X POST https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer xoxb-your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "#app-releases",
    "text": "Hello from App Distribution Bot! 🤖"
  }'
```

### Using the Firebase Function

Once deployed, test with:

```bash
curl -X POST https://your-function-url/test/notification \
  -H "Content-Type: application/json" \
  -d '{
    "releaseId": "test",
    "platform": "android"
  }'
```

## Message Format Example

The bot will send rich messages like this:

```
🤖 New ANDROID Build Available

App: My Android App
Version: 1.0.0 (123)
Platform: ANDROID
Release Date: Jan 1, 2024, 12:00 PM

Release Notes:
• Bug fixes and improvements
• New feature X
• Performance optimizations

[📱 Download App] (button)

📱 Android Installation: Download the APK and enable "Install from Unknown Sources" in your device settings if prompted.
```

## Troubleshooting

### Bot Not Responding

1. **Check token**: Ensure the bot token is correct and hasn't been regenerated
2. **Check permissions**: Verify the bot has `chat:write` permission
3. **Check channel**: Make sure the bot is added to the target channel
4. **Check workspace**: Confirm the bot is installed in the correct workspace

### Permission Errors

1. **"not_in_channel"**: Add the bot to the channel or use `chat:write.public` scope
2. **"missing_scope"**: Add the required OAuth scope in app settings
3. **"invalid_auth"**: Check that the token is correct and not expired

### Message Formatting Issues

1. **Rich text not displaying**: Ensure you're using the Blocks API format
2. **Links not working**: Check URL formatting and encoding
3. **Buttons not appearing**: Verify the app has interactive components enabled

## Security Best Practices

1. **Store tokens securely**: Use Firebase functions config or environment variables
2. **Rotate tokens regularly**: Generate new tokens periodically
3. **Limit permissions**: Only grant necessary OAuth scopes
4. **Monitor usage**: Check Slack's rate limits and usage statistics
5. **Use signing secrets**: Verify webhook signatures in production

## Advanced Features

### Interactive Buttons

Add interactive buttons for actions like:
- Download app
- View release notes
- Report issues
- Request access

### Thread Responses

Reply in threads for:
- Build status updates
- Error notifications
- Follow-up information

### Custom Emoji Reactions

Use emoji reactions to indicate:
- ✅ Build successful
- ❌ Build failed
- 🚀 Ready for testing
- 🐛 Issues found

### Rich Attachments

Include additional information:
- App screenshots
- QR codes for easy download
- Build artifacts
- Test reports
