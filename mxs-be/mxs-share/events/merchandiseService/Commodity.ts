import {
  CommodityChannels,
  CommodityStatus,
} from "../../enums/merchandiseService/Commodity";

export interface CommodityCreateEvent {
  topic: CommodityChannels.Create;
  data: {
    id: string;
    code: string;
    name: string;
    status: CommodityStatus;
    note?: string;
    item: string;
    instrument: string[];
    createdBy?: string;
  };
}

export interface CommodityUpdateEvent {
  topic: CommodityChannels.Update;
  data: {
    id: string;
    code: string;
    name: string;
    status: CommodityStatus;
    note?: string;
    item: string;
    instrument: string[];
    lastModifiedBy?: string;
  };
}
