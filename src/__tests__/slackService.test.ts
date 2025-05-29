import { SlackService } from '../services/slackService';
import { WebClient } from '@slack/web-api';

describe('SlackService', () => {
  let slackService: SlackService;
  let mockClient: jest.Mocked<WebClient>;

  beforeEach(() => {
    mockClient = {
      chat: {
        postMessage: jest.fn().mockResolvedValue({ ok: true })
      }
    } as any;

    slackService = new SlackService(mockClient);
  });

  describe('sendBuildNotification', () => {
    it('should send formatted build notification', async () => {
      const buildMetadata = {
        platform: 'android' as const,
        appName: 'Test App',
        version: '1.0.0',
        buildNumber: '123',
        releaseDate: '2024-01-01T00:00:00Z',
        downloadUrl: 'https://example.com/download',
        releaseNotes: 'Test release notes'
      };

      await slackService.sendBuildNotification(buildMetadata);

      expect(mockClient.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: expect.any(String),
          text: expect.stringContaining('ANDROID'),
          blocks: expect.any(Array)
        })
      );
    });

    it('should handle missing release notes', async () => {
      const buildMetadata = {
        platform: 'ios' as const,
        appName: 'Test App',
        version: '1.0.0',
        buildNumber: '123',
        releaseDate: '2024-01-01T00:00:00Z',
        downloadUrl: 'https://example.com/download'
      };

      await slackService.sendBuildNotification(buildMetadata);

      expect(mockClient.chat.postMessage).toHaveBeenCalled();
    });
  });

  describe('sendErrorNotification', () => {
    it('should send error notification', async () => {
      const error = new Error('Test error');
      const context = { test: 'context' };

      await slackService.sendErrorNotification(error, context);

      expect(mockClient.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('Error'),
          blocks: expect.arrayContaining([
            expect.objectContaining({
              type: 'header'
            })
          ])
        })
      );
    });
  });
});
