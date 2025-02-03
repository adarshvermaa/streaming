export interface IWorkspaceMember {
  workspaceId: string;
  userId: string;
  role?: "admin" | "member" | "guest"; // Default: "member"
  invitationStatus?: "pending" | "accepted" | "rejected"; // Default: "pending"
  invitedBy?: string;
  invitedAt?: Date;
  joinedAt?: Date;
  lastActiveAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  permissions?: string[]; // Optional permissions array
  notes?: string;
}

export interface IUpdateWorkspaceMember {
  workspaceId: string;
  userId: string;
  role?: "admin" | "member" | "guest";
  invitationStatus?: "pending" | "accepted" | "rejected";
  joinedAt?: Date;
  lastActiveAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  permissions?: string[];
  notes?: string;
}
