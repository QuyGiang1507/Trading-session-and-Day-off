import { TradingSessionChannels } from "../../enums/systemCfgService/TradingSession";

export interface TradingSessionCreateEvent {
    topic: TradingSessionChannels.Create;
    data: {
        id: string;
        startTime: string;
        endTime: string;
        commodity: string;
        item: string;
        tradingPeriods: [
            preOpen: {
                startTime: string;
                endTime: string;
            },
            open: {
                startTime: string;
                endTime: string;
            },
            pause: {
                startTime: string;
                endTime: string;
            },
            close: {
                startTime: string;
                endTime: string;
            },
            maintenancePeriod: {
                startTime: string;
                endTime: string;
            },
        ];
        isGenaralSession: boolean;
        createdBy?: string;
        createdAt?: string;
    }
}

export interface TradingSessionUpdateEvent {
    topic: TradingSessionChannels.Update;
    data: {
        id: string;
        startTime: string;
        endTime: string;
        commodity: string;
        item: string;
        tradingPeriods: [
            preOpen: {
                startTime: string;
                endTime: string;
            },
            open: {
                startTime: string;
                endTime: string;
            },
            pause: {
                startTime: string;
                endTime: string;
            },
            close: {
                startTime: string;
                endTime: string;
            },
            maintenancePeriod: {
                startTime: string;
                endTime: string;
            },
        ];
        lastModifiedBy?: string;
        updateddAt?: string;
    }
}