import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { WebClient } from '@slack/web-api';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { AppDistributionService } from './services/appDistributionService';
import { SlackService } from './services/slackService';
import { WebhookHandler } from './handlers/webhookHandler';
import { validateWebhookSignature } from './middleware/security';
import { logger } from './utils/logger';
import { config } from './config/environments';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize services
const slackClient = new WebClient(config.slack.token);
const appDistributionService = new AppDistributionService();
const slackService = new SlackService(slackClient);
const webhookHandler = new WebhookHandler(appDistributionService, slackService);

// Express app setup
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.raw({ type: 'application/json' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Webhook endpoint for Firebase App Distribution
app.post('/webhook/app-distribution', 
  validateWebhookSignature,
  async (req, res) => {
    try {
      logger.info('Received App Distribution webhook', { 
        headers: req.headers,
        body: req.body 
      });

      await webhookHandler.handleAppDistributionEvent(req.body);
      
      res.status(200).json({ success: true });
    } catch (error) {
      logger.error('Error processing webhook', error as Error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Test endpoint for manual testing
app.post('/test/notification', async (req, res) => {
  try {
    const { releaseId, platform } = req.body;
    
    if (!releaseId || !platform) {
      return res.status(400).json({ 
        error: 'Missing required fields: releaseId, platform' 
      });
    }

    await webhookHandler.handleTestNotification(releaseId, platform);
    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Error in test notification', error as Error);
    return res.status(500).json({ error: 'Failed to send test notification' });
  }
});

// Export Cloud Function
export const appDistributionBot = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '1GB'
  })
  .https
  .onRequest(app);
