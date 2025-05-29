# Step 6: Test the Complete Setup

## 6.1 Upload a Test Build
1. Build your poker app (Android APK or iOS IPA)
2. Go to Firebase Console → App Distribution
3. Upload your build file
4. Add some testers or tester groups
5. Click "Distribute"

## 6.2 Check Slack
Within a few seconds, you should see a message in #app_distribution like:

```
🤖 New ANDROID Build Available

App: Poker Game
Version: 1.0.0 (123)
Platform: ANDROID
Release Date: 5/29/2025, 5:30:15 PM

Release Notes:
• Fixed card dealing bug
• Improved UI
• Performance optimizations

[📱 Download App]

📱 Installation: Click the download button above. The app is available to everyone in this channel.
```

## 6.3 Manual Test (if needed)
If you don't see a message, test manually:

```bash
# Test the webhook endpoint directly
curl -X POST "https://us-central1-poker-12345.cloudfunctions.net/appDistributionBot/test/notification" \
  -H "Content-Type: application/json" \
  -d '{"releaseId":"test123","platform":"android"}'
```

## 6.4 Check Logs
If something goes wrong:
```bash
firebase functions:log --only appDistributionBot
```

✅ If you see the Slack message, everything is working perfectly!
