import { WorkspaceMembersModel } from "../../models/synkro/workspace_members.model";
import db from "../../../config/database/database";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { ENV } from "../../../config/env";

export const createWorkspaceInvitationService = async (
  workspaceId: string,
  invitedUserId: string,
  invitedBy: string
) => {
  // Check if user is already a member
  const [existingMember] = await db
    .select()
    .from(WorkspaceMembersModel)
    .where(
      eq(WorkspaceMembersModel.workspaceId, workspaceId) &&
        eq(WorkspaceMembersModel.userId, invitedUserId)
    )
    .limit(1);
  if (existingMember) {
    if (existingMember.invitationStatus === "accepted") {
      return {
        errorMassage: "User is already a member of this workspace",
        invitationLink: null,
        expiresAt: null,
      };
    }
    if (existingMember.invitationStatus === "pending") {
      return {
        errorMassage: "Invitation already pending for this user",
        invitationLink: null,
        expiresAt: null,
      };
    }
  }

  const invitationToken = randomUUID();
  const invitationExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiration
  const data = {
    workspaceId,
    userId: invitedUserId,
    invitedBy,
    invitationToken,
    invitationStatus: "pending",
    invitedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  //   const dataSet = {
  //     invitationToken,
  //     invitationStatus: "pending",
  //     invitedAt: new Date(),
  //     updatedAt: new Date(),
  //   };
  const [invitation] = await db
    .insert(WorkspaceMembersModel)
    .values(data)
    .onConflictDoUpdate({
      target: [WorkspaceMembersModel.workspaceId, WorkspaceMembersModel.userId],
      set: data,
    })
    .returning();

  return {
    invitationLink: `${ENV.FRONTEND_URL_LIVE}/invite/${invitation.invitationToken}`,
    expiresAt: invitationExpiresAt,
  };
};

export const acceptInvitationService = async (token: string) => {
  return db.transaction(async (tx) => {
    const [invitation] = await tx
      .select()
      .from(WorkspaceMembersModel)
      .where(eq(WorkspaceMembersModel.invitationToken, token))
      .limit(1);

    if (!invitation) {
      throw new Error("Invalid invitation token");
    }

    if (invitation.invitationStatus !== "pending") {
      throw new Error("Invitation has already been processed");
    }
    const data = {
      workspaceId: invitation.workspaceId,
      userId: invitation.userId,
      invitationStatus: "accepted",
      joinedAt: new Date(),
      updatedAt: new Date(),
      invitationToken: null,
    };
    const [updatedMember] = await tx
      .update(WorkspaceMembersModel)
      .set(data)
      .where(eq(WorkspaceMembersModel.invitationToken, token))
      .returning();
    return updatedMember;
  });
};
