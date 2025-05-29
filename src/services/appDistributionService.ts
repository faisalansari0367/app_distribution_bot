import * as admin from 'firebase-admin';
import { logger } from '../utils/logger';
import { AppDistributionEvent, BuildMetadata, TesterGroup } from '../types';

export class AppDistributionService {
  private firestore: admin.firestore.Firestore;

  constructor() {
    this.firestore = admin.firestore();
  }

  /**
   * Process App Distribution webhook event
   */
  async processWebhookEvent(event: AppDistributionEvent): Promise<BuildMetadata> {
    logger.info('Processing App Distribution event', {
      eventType: event.eventType,
      releaseId: event.data.release.releaseId,
      platform: event.data.app.platform
    });

    const release = event.data.release;
    const app = event.data.app;

    // Extract build metadata
    const buildMetadata: BuildMetadata = {
      platform: app.platform,
      appName: app.displayName,
      version: release.displayVersion,
      buildNumber: release.buildVersion,
      releaseDate: release.createTime,
      downloadUrl: release.downloadUrl || '',
      releaseNotes: release.releaseNotes?.text,
    };

    // Get download URL if not provided
    if (!buildMetadata.downloadUrl) {
      buildMetadata.downloadUrl = await this.getDownloadUrl(release.releaseId);
    }

    // Add testers and manage permissions
    await this.manageTesters(release.releaseId, app.platform);

    logger.info('Successfully processed build metadata', buildMetadata);
    return buildMetadata;
  }

  /**
   * Get download URL for a release
   */
  private async getDownloadUrl(releaseId: string): Promise<string> {
    try {
      // In a real implementation, you would call Firebase App Distribution API
      // This is a placeholder implementation
      return `https://appdistribution.firebase.dev/i/${releaseId}`;
    } catch (error) {
      logger.error('Failed to get download URL', error as Error, { releaseId });
      throw new Error('Failed to retrieve download URL');
    }
  }

  /**
   * Manage testers for the release
   */
  private async manageTesters(releaseId: string, platform: string): Promise<void> {
    try {
      // Get tester groups from Firestore configuration
      const testerGroups = await this.getTesterGroups(platform);
      
      for (const group of testerGroups) {
        await this.addTestersToRelease(releaseId, group.emails);
        logger.debug('Added testers to release', {
          releaseId,
          groupId: group.groupId,
          testerCount: group.emails.length
        });
      }
    } catch (error) {
      logger.error('Failed to manage testers', error as Error, { releaseId, platform });
      // Don't throw - this shouldn't block the notification
    }
  }

  /**
   * Get tester groups from configuration
   */
  private async getTesterGroups(platform: string): Promise<TesterGroup[]> {
    try {
      const doc = await this.firestore
        .collection('app_distribution_config')
        .doc('tester_groups')
        .get();

      if (!doc.exists) {
        logger.warn('No tester groups configured');
        return [];
      }

      const data = doc.data();
      return data?.[platform] || [];
    } catch (error) {
      logger.error('Failed to get tester groups', error as Error, { platform });
      return [];
    }
  }

  /**
   * Add testers to a release
   */
  private async addTestersToRelease(releaseId: string, emails: string[]): Promise<void> {
    try {
      // In a real implementation, you would call Firebase App Distribution API
      // to add testers to the release
      logger.debug('Would add testers to release', { releaseId, emails });
      
      // Placeholder for actual API call:
      // await admin.appDistribution().addTesters(releaseId, emails);
    } catch (error) {
      logger.error('Failed to add testers to release', error as Error, {
        releaseId,
        emailCount: emails.length
      });
    }
  }

  /**
   * Get release metadata by ID
   */
  async getReleaseMetadata(releaseId: string): Promise<BuildMetadata | null> {
    try {
      // In a real implementation, you would call Firebase App Distribution API
      // This is a placeholder
      logger.debug('Getting release metadata', { releaseId });
      
      // Placeholder return - in real implementation, call the API
      return null;
    } catch (error) {
      logger.error('Failed to get release metadata', error as Error, { releaseId });
      return null;
    }
  }
}
