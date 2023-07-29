export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum ApprovalAction {
  CREATE = "create",
  UPDATE = "update",
}

export enum ApprovalChannels {
  Create = "merchandise-approval-created",
  Update = "merchandise-approval-updated",
}

export enum ApprovalTags {
  CreateItem = "create-item",
  UpdateItem = "update-item",

  CreateCommodity = "create-commodity",
  UpdateCommodity = "update-commodity",

  CreateInstrument = "create-instrument",
  UpdateInstrument = "update-instrument",

  CreateContract = "create-contract",
  UpdateContract = "update-contract",
}
