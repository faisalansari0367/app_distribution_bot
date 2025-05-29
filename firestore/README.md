# Firestore Configuration Templates

This directory contains templates for configuring the App Distribution Bot using Firestore.

## Setup Instructions

1. **Create Collections**: Use the Firebase Console to create these collections in your Firestore database.

2. **Import Data**: Use the Firebase CLI or Console to import the configuration data:

```bash
# Using Firebase CLI
firebase firestore:set app_distribution_config/tester_groups tester_groups.json
firebase firestore:set app_distribution_config/channel_mapping channel_mapping.json
firebase firestore:set app_distribution_config/app_settings app_settings.json
```

## Configuration Files

### tester_groups.json
Defines which testers should be automatically added to releases for each platform.

### channel_mapping.json  
Maps different app IDs to specific Slack channels for targeted notifications.

### app_settings.json
General settings for bot behavior, notification preferences, and feature flags.

## Security Rules

Add these Firestore security rules to protect your configuration:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // App Distribution Bot config - read only for functions
    match /app_distribution_config/{document=**} {
      allow read: if request.auth != null && 
                     request.auth.token.firebase.identities["google.com"][0] in [
                       "your-service-account-email@your-project.iam.gserviceaccount.com"
                     ];
      allow write: if false; // Only allow writes through Firebase Console/CLI
    }
  }
}
```

## Usage in Code

The bot automatically reads these configurations:

```typescript
// Get tester groups for platform
const testerGroups = await this.firestore
  .collection('app_distribution_config')
  .doc('tester_groups')
  .get();

// Get channel mapping for app
const channelMapping = await this.firestore
  .collection('app_distribution_config') 
  .doc('channel_mapping')
  .get();
```
