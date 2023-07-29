import { OrderRoute } from "../../enums";

export interface CreateTopicEvent {
  topic: OrderRoute.OrderEnum.OrderRouteChannels.CreateTopic;
  data: {
    topic: string;
    groupId: string;
  };
}

export interface OrderReceivedEvent {
  topic: string;
  data: {
    contractCode: string;
    side: OrderRoute.OrderEnum.Side;
    orderType: OrderRoute.OrderEnum.OrderType;
    limitPrice: number;
    stopPrice: number;
    quantity: number;
    duration: OrderRoute.OrderEnum.Duration;
    account: string;
    memberId: string;
    orderTime: number;
    orderId: number;
    action: string;
  };
}

export interface Transaction {
  topic: string;
  data: {
    incomingOrderId: number;
    incomingUserId: string;
    incomingIsBuy: boolean;
    restingOrderId: number;
    restingUserId: string;
    matchPrice: number;
    maxQuantity: number;
    askRemainingQuanity: number;
  };
}

export interface ResultOrder {
  topic: string;
  data: {
    orderId: number;
    userId: string;
    remainingQuantity?: number;
  };
}

export interface Bookdepth {
  topic: string;
  data: {
    price: number;
    timestamp: number;
    bid: any;
    ask: any;
  };
}
