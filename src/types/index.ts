export interface AppDistributionEvent {
  eventType: 'appDistribution.release.created' | 'appDistribution.release.updated';
  data: {
    release: {
      name: string;
      releaseId: string;
      createTime: string;
      displayVersion: string;
      buildVersion: string;
      releaseNotes?: {
        text: string;
      };
      firebaseAppId: string;
      downloadUrl?: string;
    };
    app: {
      appId: string;
      displayName: string;
      platform: 'android' | 'ios';
      packageName?: string;
      bundleId?: string;
    };
  };
}

export interface SlackMessageBlock {
  type: string;
  text?: {
    type: string;
    text: string;
  };
  fields?: Array<{
    type: string;
    text: string;
  }>;
  accessory?: {
    type: string;
    text: {
      type: string;
      text: string;
    };
    url: string;
    action_id: string;
  };
  elements?: Array<{
    type: string;
    text: string;
  }>;
}

export interface TesterGroup {
  groupId: string;
  displayName: string;
  emails: string[];
}

export interface BuildMetadata {
  platform: 'android' | 'ios';
  appName: string;
  version: string;
  buildNumber: string;
  releaseDate: string;
  downloadUrl: string;
  releaseNotes?: string;
  fileSize?: string;
  md5Hash?: string;
}
