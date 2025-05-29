# Step 4: Deploy to Firebase

## 4.1 Build and Deploy
```bash
# Make sure you're in the bot directory
cd /Users/mohd.faisal/app_distribution_bot

# Deploy the function to your "poker" project
npm run deploy
```

This will:
- Build the TypeScript code
- Deploy the Cloud Function to your poker project
- Give you a webhook URL

## 4.2 Note the Webhook URL
After deployment, you'll see output like:
```
✔  Deploy complete!

Function URL: https://us-central1-poker-12345.cloudfunctions.net/appDistributionBot
```

**Copy this URL** - you'll need it for Step 5!

## 4.3 Verify Deployment
```bash
# Check that the function was deployed
firebase functions:list
```

You should see `appDistributionBot` in the list.

✅ Bot is now deployed to your poker Firebase project!
