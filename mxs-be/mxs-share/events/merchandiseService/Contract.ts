import {
  ContractChannels,
  ContractStatus,
} from "../../enums/merchandiseService/Contract";

export interface ContractCreateEvent {
  topic: ContractChannels.Create;
  data: {
    id: string;
    code: string;
    name: string;
    status: ContractStatus;
    note?: string;
    commodity: string;
    instrument: string;
    createdBy?: string;
  };
}

export interface ContractUpdateEvent {
  topic: ContractChannels.Update;
  data: {
    id: string;
    code: string;
    name: string;
    status: ContractStatus;
    note?: string;
    commodity: string;
    instrument: string;
    lastModifiedBy?: string;
  };
}
