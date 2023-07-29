import { LogChannels } from '../enums/LogChannels';

export interface ActivityLogEvent {
    topic: LogChannels.ActivityLog;
    data: {
      module: string,
      action: string,
      logType: string;
      userId: string;
      sessionId: string;
      ipAddress: string,
      userAgent: string,
      datetime: number,
      description: string
    };
  }
