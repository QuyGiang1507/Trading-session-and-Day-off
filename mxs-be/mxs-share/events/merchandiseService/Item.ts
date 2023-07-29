import { ItemChannels } from "../../enums/merchandiseService/Item";

export interface ItemCreateEvent {
  topic: ItemChannels.Create;
  data: {
    id: string;
    code: string;
    name: string;
    status: string;
    createdBy: string;
  };
}

export interface ItemUpdateEvent {
  topic: ItemChannels.Update;
  data: {
    id: string;
    code: string;
    name: string;
    status: string;
    instrument: string;
    commodity: string[];
    note?: string;
    lastModifiedBy?: string;
  };
}
