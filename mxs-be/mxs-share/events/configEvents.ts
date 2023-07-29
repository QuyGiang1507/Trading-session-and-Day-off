import { CfgChannels } from '../enums/CfgChannels';
import { CfgLoadTypes } from '../enums/CfgLoadTypes';

export interface CfgCreateEvent {
    topic: CfgChannels.Create;
    data: {
      id: string;
      key: string;
      value: Object;
      createdBy: string;
      createdTime: number;
      lastModifiedBy?: string;
      lastModifiedTime?: number;
    };
  }

export interface CfgUpdateEvent {
    topic: CfgChannels.Update;
    data: {
      id: string;
      key: string;
      value: Object;
      createdBy: string;
      createdTime: number;
      lastModifiedBy?: string;
      lastModifiedTime?: number;
    };
  }

export interface CfgDeleteEvent {
    topic: CfgChannels.Delete;
    data: {
      key: string;
    };
  }

export interface CfgReloadEvent {
    topic: CfgChannels.Reload;
    data: {
      key: string;
      loadType: CfgLoadTypes;
    };
  }
