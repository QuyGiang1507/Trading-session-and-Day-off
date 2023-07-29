import { Publisher } from "@mxs/common";
import { TradingSessionEnum, TradingSessionEvent } from "@mxs/share";

export class createTradingSessionPublisher extends Publisher<TradingSessionEvent.TradingSessionCreateEvent> {
    readonly topic: TradingSessionEvent.TradingSessionCreateEvent["topic"] = TradingSessionEnum.TradingSessionChannels.Create;
    readonly groupId: string = "event-trading-session";

    async publish(data): Promise<void> {
        await super.publish(data);
    }
}

export class updateTradingSessionPublisher extends Publisher<TradingSessionEvent.TradingSessionUpdateEvent> {
    readonly topic: TradingSessionEvent.TradingSessionUpdateEvent["topic"] = TradingSessionEnum.TradingSessionChannels.Update;
    readonly groupId: string = "event-trading-session";

    async publish(data): Promise<void> {
        await super.publish(data);
    }
}