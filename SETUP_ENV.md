# Step 3: Configure Environment Variables

## 3.1 Edit .env File
Replace the placeholder values in `.env` with your actual Slack credentials:

```bash
# Open the .env file in your editor
code .env  # or vim .env, nano .env, etc.
```

Replace:
```
SLACK_TOKEN=xoxb-your-slack-bot-token-here
SLACK_SIGNING_SECRET=your-slack-signing-secret
```

With your actual values from Step 1:
```
SLACK_TOKEN=xoxb-1234567890-1234567890123-abcdefghijklmnopqrstuvwx
SLACK_SIGNING_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

## 3.2 Verify Configuration
```bash
# Check that your .env file has the correct format
cat .env
```

⚠️ **Important**: Never commit the `.env` file to git! It should be in `.gitignore`.

✅ Environment variables are now configured!
