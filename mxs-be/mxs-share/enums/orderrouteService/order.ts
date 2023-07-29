export enum Side {
  Buy = "B",
  Sell = "S",
}

export enum OrderType {
  Limit = "LMT",
  Market = "MKT",
  StopLimit = "STL",
  Stop = "STP",
}

export enum Duration {
  Gtc = "GTC",
  Day = "DAY",
}

export enum ResponseCode {
  OrderSuccess = 10,
  OrderInvalid = 21,
}

export enum OrderRouteChannels {
  CreateTopic = "orderroute-create-topic",
}

export enum OrderEventSocket {
  NewOrder = "NewOrder",
  EditOrder = "EditOrder",
  CancelOrder = "CancelOrder",
}

export enum OrderEventResponseSocket {
  OdCreateSuccess = "OrderCreateSuccess",
  OdCreateFail = "OrderCreateFail",
  OdUpdateSuccess = "OrderUpdateSuccess",
  OdUpdateFail = "OrderUpdateFail",
  OdCancelSuccess = "OrderCancelSuccess",
  OdCancelFail = "OrderCancelFail",
}
