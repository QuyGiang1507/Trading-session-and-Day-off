import { Message } from "node-rdkafka";
import { Listener } from "@mxs/common";
import { DayOffEnum, DayOffEvent } from "@mxs/share";

import { Logger } from "@mxs/common";

import { configLoader } from "../configLoader";
import DayOffModel from "../models/dayOffModel";

export class dayOffListener extends Listener<DayOffEvent.FixedDayOffCreateEvent> {
  readonly topic: DayOffEvent.FixedDayOffCreateEvent["topic"] = DayOffEnum.FixedDayOffChannels.Create;
  readonly groupId: string = "event-day-off";

  // Capture event here!!!!
  async onMessage(
    data: DayOffEvent.FixedDayOffCreateEvent["data"],
    msg: Message,
    partition: number
  ) {
    console.log("Listen massage!");
  }
};