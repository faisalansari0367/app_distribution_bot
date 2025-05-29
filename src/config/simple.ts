// Minimal configuration for Firebase App Distribution to Slack bot
export interface Config {
    slack: {
        token: string;
        channel: string;
        signingSecret: string;
    };
}

// Everything goes to #app_distribution channel - no complex routing
export const config: Config = {
    slack: {
        token: process.env.SLACK_TOKEN || '',
        channel: '#app_distribution', // Fixed channel for all notifications
        signingSecret: process.env.SLACK_SIGNING_SECRET || ''
    }
};
