export interface Config {
  slack: {
    token: string;
    channel: string;
    signingSecret: string;
  };
  firebase: {
    projectId: string;
    region: string;
  };
  app: {
    environment: 'development' | 'staging' | 'production';
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
  security: {
    enableSignatureValidation: boolean;
    rateLimitPerMinute: number;
  };
}

const getEnvironmentConfig = (): Config => {
  const environment = process.env.NODE_ENV as 'development' | 'staging' | 'production' || 'development';
  
  // Base configuration
  const baseConfig: Config = {
    slack: {
      token: process.env.SLACK_TOKEN || '',
      channel: process.env.SLACK_CHANNEL || '#app-releases',
      signingSecret: process.env.SLACK_SIGNING_SECRET || ''
    },
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID || '',
      region: process.env.FIREBASE_REGION || 'us-central1'
    },
    app: {
      environment,
      logLevel: 'info'
    },
    security: {
      enableSignatureValidation: true,
      rateLimitPerMinute: 60
    }
  };

  // Environment-specific overrides
  switch (environment) {
    case 'development':
      return {
        ...baseConfig,
        app: {
          ...baseConfig.app,
          logLevel: 'debug'
        },
        security: {
          ...baseConfig.security,
          enableSignatureValidation: false,
          rateLimitPerMinute: 100
        }
      };
    
    case 'staging':
      return {
        ...baseConfig,
        slack: {
          ...baseConfig.slack,
          channel: '#app-releases-staging'
        }
      };
    
    case 'production':
      return baseConfig;
    
    default:
      return baseConfig;
  }
};

export const config = getEnvironmentConfig();
