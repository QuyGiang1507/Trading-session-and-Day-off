import {
  ApprovalChannels,
  ApprovalAction,
} from "../../enums/authService/approval";

export interface NewApprovalEvent {
  topic: ApprovalChannels.NewApproval;
  data: {
    apiUrl: string;
    collectionName: string;
    documentId: string;
    description: string;
    action: ApprovalAction;
    oldValue: string;
    pendingValue: string;
    createdBy?: string;
  };
}

export interface ApprovalCreatedEvent {
  topic: ApprovalChannels.Create;
  data: {
    id: string;
    apiUrl: string;
    collectionName: string;
    documentId: string;
    description: string;
    action: ApprovalAction;
    createdBy?: string;
    createdAt?: string;
  };
}

export interface ApprovalUpdatedEvent {
  topic: ApprovalChannels.Update;
  data: {
    id: string;
    apiUrl: string;
    collectionName: string;
    documentId: string;
    description: string;
    action: ApprovalAction;
    lastModifiedBy?: string;
    updatedAt?: string;
  };
}
