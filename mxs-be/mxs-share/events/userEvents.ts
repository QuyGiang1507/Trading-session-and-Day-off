import { UserChannels } from '../enums/UserChannels';

export interface UserCreateEvent {
    topic: UserChannels.Create;
    data: {
      id: string;
      email: string;
      status: string;
      createdBy: string;
      createdTime: number;
      lastModifiedBy?: string;
      lastModifiedTime?: number;
      groupRoles: Object[];
    };
  }

export interface UserUpdateEvent {
    topic: UserChannels.Update;
    data: {
      id: string;
      email: string;
      lastModifiedBy?: string;
      lastModifiedTime?: number;
    };
  }

export interface UserDeleteEvent {
    topic: UserChannels.Delete;
    data: {
      id: string;
    };
  }

export interface UserLoginEvent {
    topic: UserChannels.Login;
    data: {
      id: string;
      email: string;
      sessionId: string;
      token: string;
    };
  }

export interface UserExpiredEvent {
  topic: UserChannels.Expired;
  data: {
    id: string;
    email: string;
    sessionId: string;
    token: string;
  };
}

export interface UserLogoutEvent {
  topic: UserChannels.Logout;
  data: {
    id: string;
    email: string;
    sessionId: string;
  };
}
 