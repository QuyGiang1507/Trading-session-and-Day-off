import { Publisher } from "@mxs/common";
import { DayOffEnum, DayOffEvent } from "@mxs/share";
import DayOffModel from "../models/dayOffModel";

export class createUnfixedDayOffPublisher extends Publisher<DayOffEvent.UnfixedDayOffCreateEvent> {
    readonly topic: DayOffEvent.UnfixedDayOffCreateEvent["topic"] = DayOffEnum.UnfixedDayOffChannels.Create;
    readonly groupId: string = "event-day-off";

    async publish(data): Promise<void> {
        await super.publish(data);
    }
}

export class updateUnfixedDayOffPublisher extends Publisher<DayOffEvent.UnfixedDayOffUpdateEvent> {
    readonly topic: DayOffEvent.UnfixedDayOffUpdateEvent["topic"] = DayOffEnum.UnfixedDayOffChannels.Update;
    readonly groupId: string = "event-day-off";

    async publish(data): Promise<void> {
        await super.publish(data);
    }
}

export class createFixedDayOffPublisher extends Publisher<DayOffEvent.FixedDayOffCreateEvent> {
    readonly topic: DayOffEvent.FixedDayOffCreateEvent["topic"] = DayOffEnum.FixedDayOffChannels.Create;
    readonly groupId: string = "event-day-off";

    async publish(data): Promise<void> {
        await super.publish(data);
    }
}

export class updateFixedDayOffPublisher extends Publisher<DayOffEvent.FixedDayOffUpdateEvent> {
    readonly topic: DayOffEvent.FixedDayOffUpdateEvent["topic"] = DayOffEnum.FixedDayOffChannels.Update;
    readonly groupId: string = "event-day-off";

    async publish(data): Promise<void> {
        await super.publish(data);
    }
}