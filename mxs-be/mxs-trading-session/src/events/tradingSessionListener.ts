import { Message } from "node-rdkafka";
import { Listener } from "@mxs/common";
import { TradingSessionEnum, TradingSessionEvent } from "@mxs/share";

import { Logger } from "@mxs/common";

import { configLoader } from "../configLoader";
import TradingSessionModel from "../models/tradingSessionModel";

export class tradingSessionListener extends Listener<TradingSessionEvent.TradingSessionUpdateEvent> {
  readonly topic: TradingSessionEvent.TradingSessionUpdateEvent["topic"] = TradingSessionEnum.TradingSessionChannels.Update;
  readonly groupId: string = "event-trading-session";

  // Capture event here!!!!
  async onMessage(
    data: TradingSessionEvent.TradingSessionUpdateEvent["data"],
    msg: Message,
    partition: number
  ) {
    console.log("Listen massage!");
  }
};