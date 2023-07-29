import { OrderRoute } from "../../enums";

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
    orderId: string;
    action: string;
  };
}
