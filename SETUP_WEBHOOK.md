# Step 5: Configure Firebase App Distribution Webhook

## 5.1 Go to Firebase Console
1. Open https://console.firebase.google.com/
2. Select your **"poker"** project
3. Go to "App Distribution" in the left sidebar

## 5.2 Set Up Webhook
1. Click on "Integrations" tab (or look for webhook settings)
2. Find "Webhooks" section
3. Click "Add webhook" or "Configure webhook"

## 5.3 Enter Webhook Details
- **Webhook URL**: `https://us-central1-poker-12345.cloudfunctions.net/appDistributionBot/webhook/app-distribution`
  (Replace with your actual function URL from Step 4 + `/webhook/app-distribution`)
- **Events**: Select "Release created" and "Release updated"
- **Secret**: Leave blank (optional for this simple setup)

## 5.4 Test the Webhook
1. Click "Test webhook" if available
2. Or upload a test build to verify it works

## 5.5 Save Configuration
Click "Save" or "Create webhook"

✅ Webhook is now configured to send events to your bot!

## What Happens Next:
- When you upload any app to Firebase App Distribution
- Firebase will send a webhook to your Cloud Function
- Your bot will post a notification to #app_distribution
- Everyone in that channel can download the build
