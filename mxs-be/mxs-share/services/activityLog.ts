import { Publisher } from '@mxs/common';
import {ActivityLogEvent} from '../events/logEvents';
import { LogChannels, LogTypes } from '../enums';
import { EventEmitter } from 'events';

export class activityLog extends EventEmitter {
  activityPublisher: Publisher<ActivityLogEvent>;
  client = {};
  module: string;
  
  constructor() {
    super();
  }

  connect(module: string, kafka)
  {
    this.module = module;
    this.client = kafka;
    this.activityPublisher = new Publisher<ActivityLogEvent>(this.client);
    this.activityPublisher.connect(LogChannels.ActivityLog);        
  }

  async info(req, message) {
    await this.log(LogTypes.Info, req, message);
  }

  async error(req, message) {
    await this.log(LogTypes.Error, req, message);
  }

  async warn(req, message) {
    await this.log(LogTypes.Warn, req, message);
  }

  async log(logType, req, message) {
    let action = `${req.method}${req.route.path}`;
    action = action.replace(/\//g, '_').replace(/_:\w+/g, '').toUpperCase();

    const actLog = {
        module: this.module,
        action: action,
        logType: logType,
        userId: req.currentUser?.id,
        sessionId: req.currentUser?.sessionId,
        ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        datetime: (new Date()).getTime(),
        description: message
      }
    await this.activityPublisher.publish(actLog);
  }
}