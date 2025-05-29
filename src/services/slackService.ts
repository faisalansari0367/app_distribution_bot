import { WebClient } from '@slack/web-api';
import { logger } from '../utils/logger';
import { BuildMetadata, SlackMessageBlock } from '../types';
import { config } from '../config/environments';

export class SlackService {
  private client: WebClient;

  constructor(client: WebClient) {
    this.client = client;
  }

  /**
   * Send build notification to Slack
   */
  async sendBuildNotification(buildMetadata: BuildMetadata): Promise<void> {
    try {
      const message = this.createBuildMessage(buildMetadata);
      
      await this.client.chat.postMessage({
        channel: config.slack.channel,
        ...message
      });

      logger.info('Successfully sent Slack notification', {
        platform: buildMetadata.platform,
        appName: buildMetadata.appName,
        version: buildMetadata.version
      });
    } catch (error) {
      logger.error('Failed to send Slack notification', error as Error, buildMetadata);
      throw error;
    }
  }

  /**
   * Create formatted Slack message
   */
  private createBuildMessage(build: BuildMetadata) {
    const platformEmoji = build.platform === 'ios' ? '🍎' : '🤖';
    const releaseDate = new Date(build.releaseDate).toLocaleString();

    const blocks: SlackMessageBlock[] = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${platformEmoji} New ${build.platform.toUpperCase()} Build Available`
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*App:* ${build.appName}`
          },
          {
            type: 'mrkdwn',
            text: `*Version:* ${build.version} (${build.buildNumber})`
          },
          {
            type: 'mrkdwn',
            text: `*Platform:* ${build.platform.toUpperCase()}`
          },
          {
            type: 'mrkdwn',
            text: `*Release Date:* ${releaseDate}`
          }
        ]
      }
    ];

    // Add release notes if available
    if (build.releaseNotes && build.releaseNotes.trim()) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Release Notes:*\n${build.releaseNotes}`
        }
      });
    }

    // Add download section
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Download the app:*'
      },
      accessory: {
        type: 'button',
        text: {
          type: 'plain_text',
          text: '📱 Download App'
        },
        url: build.downloadUrl,
        action_id: 'download_app'
      }
    });

    // Add installation instructions
    const installInstructions = this.getInstallationInstructions(build.platform);
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: installInstructions
        }
      ]
    });

    return {
      text: `New ${build.platform.toUpperCase()} build: ${build.appName} ${build.version}`,
      blocks,
      unfurl_links: false,
      unfurl_media: false
    };
  }

  /**
   * Get platform-specific installation instructions
   */
  private getInstallationInstructions(platform: string): string {
    if (platform === 'ios') {
      return '📱 *iOS Installation:* Open the link on your iOS device and follow the installation prompts. You may need to trust the developer certificate in Settings > General > VPN & Device Management.';
    } else {
      return '📱 *Android Installation:* Download the APK and enable "Install from Unknown Sources" in your device settings if prompted.';
    }
  }

  /**
   * Send error notification to Slack
   */
  async sendErrorNotification(error: Error, context?: any): Promise<void> {
    try {
      const message = {
        channel: config.slack.channel,
        text: '🚨 App Distribution Bot Error',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🚨 App Distribution Bot Error'
            }
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Error:* ${error.message}\n*Time:* ${new Date().toISOString()}`
            }
          }
        ]
      };

      if (context) {
        message.blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Context:*\n\`\`\`${JSON.stringify(context, null, 2)}\`\`\``
          }
        });
      }

      await this.client.chat.postMessage(message);
    } catch (slackError) {
      logger.error('Failed to send error notification to Slack', slackError as Error);
    }
  }

  /**
   * Send test notification
   */
  async sendTestNotification(): Promise<void> {
    const testMessage = {
      channel: config.slack.channel,
      text: '🧪 Test notification from App Distribution Bot',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '🧪 *Test Notification*\n\nApp Distribution Bot is working correctly!'
          }
        }
      ]
    };

    await this.client.chat.postMessage(testMessage);
    logger.info('Sent test notification to Slack');
  }
}
