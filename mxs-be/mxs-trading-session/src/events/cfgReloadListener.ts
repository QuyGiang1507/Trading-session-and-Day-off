import { Message } from "node-rdkafka";
import { Listener } from "@mxs/common";
import { CfgChannels, CfgReloadEvent } from "@mxs/share";
import { configLoader } from "../configLoader";

export class cfgReloadListener extends Listener<CfgReloadEvent> {
  readonly topic: CfgReloadEvent["topic"] = CfgChannels.Reload;
  readonly groupId: string = "event-trading-session";

  // Capture event here!!!!
  onMessage(
    data: CfgReloadEvent["data"],
    msg: Message,
    partition: number
  ): void {

    configLoader.reload();
  }
}
