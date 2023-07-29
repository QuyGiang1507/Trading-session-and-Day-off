import {
  InstrumentChannels,
  TypeOfOption,
  TypeOfPaymentMethod,
} from "../../enums/merchandiseService/Instrument";

export interface InstrumentCreateEvent {
  topic: InstrumentChannels.Create;
  data: {
    id: string;
    name: string;
    currencyUnit: string;
    contractUnit: string;
    priceListingUnit: number;
    contractVolume: number;
    tickSize: number;
    decimal: number;
    dueMonths: string;
    paymentMethod: TypeOfPaymentMethod;
    typeOfOption: TypeOfOption;
    firstTradingDay: string;
    lastTradingDay: string;
    firstNoticeDay: string;
    lastNoticeDay: string;
    firstDeliveryDay: string;
    lastDeliveryDay: string;
    inheritrix?: string[];
    group: string;
    groupName: string;
    enable: boolean;
    extend?: string;
    note?: string;
    createdBy?: string;
  };
}

export interface InstrumentUpdateEvent {
  topic: InstrumentChannels.Update;
  data: {
    id: string;
    name: string;
    currencyUnit: string;
    contractUnit: string;
    priceListingUnit: number;
    contractVolume: number;
    tickSize: number;
    decimal: number;
    dueMonths: string;
    paymentMethod: TypeOfPaymentMethod;
    typeOfOption: TypeOfOption;
    firstTradingDay: string;
    lastTradingDay: string;
    firstNoticeDay: string;
    lastNoticeDay: string;
    firstDeliveryDay: string;
    lastDeliveryDay: string;
    inheritrix?: string[];
    group: string;
    groupName: string;
    enable: boolean;
    extend?: string;
    note?: string;
    lastModifiedBy?: string;
  };
}
