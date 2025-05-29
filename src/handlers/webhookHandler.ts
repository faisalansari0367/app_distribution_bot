import { AppDistributionService } from '../services/appDistributionService';
import { SlackService } from '../services/slackService';
import { logger } from '../utils/logger';
import { AppDistributionEvent } from '../types';

export class WebhookHandler {
  constructor(
    private appDistributionService: AppDistributionService,
    private slackService: SlackService
  ) {}

  /**
   * Handle Firebase App Distribution webhook event
   */
  async handleAppDistributionEvent(eventData: any): Promise<void> {
    try {
      // Validate event structure
      if (!this.isValidAppDistributionEvent(eventData)) {
        logger.warn('Invalid webhook event structure', { eventData });
        return;
      }

      const event = eventData as AppDistributionEvent;
      
      // Only process release created/updated events
      if (!['appDistribution.release.created', 'appDistribution.release.updated'].includes(event.eventType)) {
        logger.debug('Ignoring non-release event', { eventType: event.eventType });
        return;
      }

      logger.info('Processing App Distribution webhook', {
        eventType: event.eventType,
        releaseId: event.data.release.releaseId,
        appName: event.data.app.displayName,
        platform: event.data.app.platform
      });

      // Process the build and get metadata
      const buildMetadata = await this.appDistributionService.processWebhookEvent(event);

      // Send Slack notification
      await this.slackService.sendBuildNotification(buildMetadata);

      logger.info('Successfully processed webhook event', {
        releaseId: event.data.release.releaseId,
        platform: event.data.app.platform
      });

    } catch (error) {
      logger.error('Error processing webhook event', error as Error, { eventData });
      
      // Send error notification to Slack
      try {
        await this.slackService.sendErrorNotification(error as Error, {
          webhook: 'app_distribution',
          eventData: JSON.stringify(eventData, null, 2).substring(0, 500)
        });
      } catch (slackError) {
        logger.error('Failed to send error notification', slackError as Error);
      }
      
      throw error;
    }
  }

  /**
   * Handle test notification request
   */
  async handleTestNotification(releaseId: string, platform: string): Promise<void> {
    try {
      logger.info('Processing test notification', { releaseId, platform });

      // Try to get release metadata
      const metadata = await this.appDistributionService.getReleaseMetadata(releaseId);
      
      if (metadata) {
        await this.slackService.sendBuildNotification(metadata);
        logger.info('Sent test notification with real data');
      } else {
        // Send mock notification
        const mockMetadata = this.createMockBuildMetadata(platform);
        await this.slackService.sendBuildNotification(mockMetadata);
        logger.info('Sent test notification with mock data');
      }

    } catch (error) {
      logger.error('Error processing test notification', error as Error, { releaseId, platform });
      await this.slackService.sendErrorNotification(error as Error, {
        test: true,
        releaseId,
        platform
      });
      throw error;
    }
  }

  /**
   * Validate webhook event structure
   */
  private isValidAppDistributionEvent(eventData: any): boolean {
    return !!(
      eventData &&
      eventData.eventType &&
      eventData.data &&
      eventData.data.release &&
      eventData.data.app &&
      eventData.data.release.releaseId &&
      eventData.data.app.platform
    );
  }

  /**
   * Create mock build metadata for testing
   */
  private createMockBuildMetadata(platform: string) {
    const now = new Date().toISOString();
    
    return {
      platform: platform as 'android' | 'ios',
      appName: `Test App (${platform.toUpperCase()})`,
      version: '1.0.0',
      buildNumber: '123',
      releaseDate: now,
      downloadUrl: 'https://appdistribution.firebase.dev/test',
      releaseNotes: 'This is a test notification from the App Distribution Bot.\n\n• Test feature 1\n• Test feature 2\n• Bug fixes'
    };
  }

  /**
   * Send health check notification
   */
  async sendHealthCheck(): Promise<void> {
    try {
      await this.slackService.sendTestNotification();
      logger.info('Health check notification sent successfully');
    } catch (error) {
      logger.error('Health check failed', error as Error);
      throw error;
    }
  }
}
