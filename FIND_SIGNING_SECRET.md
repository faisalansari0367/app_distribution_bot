# Finding Your SLACK_SIGNING_SECRET

## Step-by-Step Instructions:

### 1. Go to Your Slack App Settings
- Visit https://api.slack.com/apps
- Click on your "Firebase App Distribution Bot" app

### 2. Navigate to Basic Information
- In the left sidebar, click "Basic Information"
- OR look for a tab called "Basic Information"

### 3. Find App Credentials Section
- Scroll down to find "App Credentials" section
- You'll see several values:

```
App Credentials
├── App ID: A1234567890
├── Client ID: 1234567890.1234567890
├── Client Secret: abc123def456ghi789 (click "Show" to reveal)
└── Signing Secret: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p (click "Show" to reveal)
```

### 4. Reveal and Copy Signing Secret
- Click "Show" next to "Signing Secret"
- Copy the revealed value (it's a long string of letters and numbers)
- This is your `SLACK_SIGNING_SECRET`

## Visual Guide:
```
Basic Information Page
└── App Credentials
    ├── App ID
    ├── Client ID  
    ├── Client Secret [Show] ← Not this one
    └── Signing Secret [Show] ← THIS ONE! 
```

## ⚠️ Security Note:
- Keep this secret safe - don't share it
- It's used to verify that webhooks actually come from Slack
