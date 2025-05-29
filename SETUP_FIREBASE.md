# Step 2: Connect to Firebase "poker" Project

## 2.1 Install Firebase CLI (if not already done)
```bash
npm install -g firebase-tools
firebase login
```

## 2.2 Initialize Firebase in Your Bot Project
```bash
cd /Users/mohd.faisal/app_distribution_bot
firebase use --add
```
- Select your "poker" project from the list
- Give it an alias like "poker" or "default"

## 2.3 Verify Project Connection
```bash
firebase projects:list
```
Make sure you see your "poker" project listed.

## 2.4 Update Firebase Configuration
The bot is already configured with `firebase.json` - verify it looks like this:
```json
{
  "functions": {
    "source": ".",
    "runtime": "nodejs18"
  }
}
```

✅ Your bot is now connected to the "poker" Firebase project!
