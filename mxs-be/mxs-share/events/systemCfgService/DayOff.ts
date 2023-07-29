import { FixedDayOffChannels, UnfixedDayOffChannels, DayOffStatus } from "../../enums/systemCfgService/DayOff"; 

export interface FixedDayOffCreateEvent {
    topic: FixedDayOffChannels.Create;
    data: {
        id: string;
        day: string;
        createdBy?: string;
        createdAt?: string;
    }
}

export interface FixedDayOffUpdateEvent {
    topic: FixedDayOffChannels.Update;
    data: {
        id: string;
        day: string;
        lastModifiedBy?: string;
        updateddAt?: string;
    }
}

export interface UnfixedDayOffCreateEvent {
    topic: UnfixedDayOffChannels.Create;
    data: {
        id: string;
        day: string;
        status: DayOffStatus;
        description: string;
        createdBy?: string;
        createdAt?: string;
    }
}

export interface UnfixedDayOffUpdateEvent {
    topic: UnfixedDayOffChannels.Update;
    data: {
        id: string;
        day: string;
        status: DayOffStatus;
        description: string;
        lastModifiedBy?: string;
        updatedAt?: string;
    }
}