# Firebase App Distribution Webhook Configuration

This document explains how to configure Firebase App Distribution webhooks to work with the Slack bot.

## Webhook Setup

### 1. Deploy the Cloud Function

First, deploy your bot using the deployment script:

```bash
./deploy.sh
```

### 2. Get the Function URL

After deployment, note the function URL. It will look like:
```
https://us-central1-your-project.cloudfunctions.net/appDistributionBot
```

### 3. Configure Firebase App Distribution Webhook

Currently, Firebase App Distribution webhooks are configured through the Firebase CLI or programmatically. Here's how to set it up:

#### Using Firebase CLI (Recommended)

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Set your project
firebase use your-project-id

# Configure the webhook
firebase appDistribution:webhook:add \
  --url="https://us-central1-your-project.cloudfunctions.net/appDistributionBot/webhook/app-distribution" \
  --events="appDistribution.release.created,appDistribution.release.updated"
```

#### Using Firebase Admin SDK (Programmatic)

```javascript
import { initializeApp, cert } from 'firebase-admin/app';
import { getAppDistribution } from 'firebase-admin/app-distribution';

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount),
  projectId: 'your-project-id'
});

const appDistribution = getAppDistribution(app);

// Add webhook
await appDistribution.addWebhook({
  url: 'https://us-central1-your-project.cloudfunctions.net/appDistributionBot/webhook/app-distribution',
  events: ['appDistribution.release.created', 'appDistribution.release.updated']
});
```

## Webhook Event Structure

The webhook will receive events in the following format:

```json
{
  "eventType": "appDistribution.release.created",
  "data": {
    "release": {
      "name": "projects/123456789/apps/1:123456789:android:abc123/releases/def456",
      "releaseId": "def456",
      "createTime": "2024-01-01T12:00:00Z",
      "displayVersion": "1.0.0",
      "buildVersion": "123",
      "releaseNotes": {
        "text": "Bug fixes and improvements"
      },
      "firebaseAppId": "1:123456789:android:abc123",
      "downloadUrl": "https://appdistribution.firebase.dev/i/def456"
    },
    "app": {
      "appId": "1:123456789:android:abc123",
      "displayName": "My Android App",
      "platform": "android",
      "packageName": "com.example.app"
    }
  }
}
```

## Testing the Webhook

### Manual Test

Use the test endpoint to verify your setup:

```bash
curl -X POST \
  https://your-function-url/test/notification \
  -H "Content-Type: application/json" \
  -d '{
    "releaseId": "test-release-123",
    "platform": "android"
  }'
```

### Health Check

```bash
curl https://your-function-url/health
```

## Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Verify the webhook URL is correct
   - Check that the webhook is properly registered
   - Ensure the Cloud Function is deployed and accessible

2. **Authentication errors**
   - Verify Slack token is correct
   - Check Firebase project permissions
   - Ensure service account has proper roles

3. **Slack messages not appearing**
   - Verify Slack channel name is correct
   - Check bot permissions in Slack workspace
   - Review function logs: `firebase functions:log`

### Debugging

Check function logs:
```bash
firebase functions:log --limit 50
```

Test locally with emulators:
```bash
npm run serve
```

## Security Considerations

1. **Webhook Signature Verification**: The bot validates webhook signatures in production
2. **Rate Limiting**: Built-in rate limiting to prevent abuse
3. **Error Handling**: Comprehensive error handling and logging
4. **Environment Separation**: Different configurations for dev/staging/production

## Advanced Configuration

### Custom Tester Groups

Configure tester groups in Firestore:

```javascript
// Collection: app_distribution_config
// Document: tester_groups
{
  "android": [
    {
      "groupId": "qa-team",
      "displayName": "QA Team",
      "emails": ["qa1@company.com", "qa2@company.com"]
    }
  ],
  "ios": [
    {
      "groupId": "ios-beta",
      "displayName": "iOS Beta Testers", 
      "emails": ["beta1@company.com", "beta2@company.com"]
    }
  ]
}
```

### Multi-Environment Support

Set different configurations for each environment:

```bash
# Development
firebase functions:config:set slack.channel="#dev-releases"

# Staging  
firebase functions:config:set slack.channel="#staging-releases"

# Production
firebase functions:config:set slack.channel="#releases"
```
