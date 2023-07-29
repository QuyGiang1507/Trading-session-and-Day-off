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
  Create = "auth-approval-created",
  Update = "auth-approval-updated",
  NewApproval = "auth-new-approval",
}

export enum ApprovalTags {
  CreateGroupRole = "create-group-role",
  UpdateGroupRole = "update-group-role",
  DeleteGroupRole = "delete-group-role",
  //User
  CreateUser = "create-user",
  UpdateProfile = "update-profile",
  AssignRoles = "assign-role",
  AssignGroupRoles = "assign-group-role",
  ChangeDepartment = "change-department",
  //Department
  CreateDept = "create-dept",
  UpdateDept = "update-dept",
}
