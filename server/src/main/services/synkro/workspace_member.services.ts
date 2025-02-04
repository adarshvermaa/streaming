import { WorkspaceMembersModel } from "../../models/synkro/workspace_members.model";
import db from "../../../config/database/database";
import { randomUUID } from "crypto";
import { and, eq, isNull } from "drizzle-orm";
import { ENV } from "../../../config/env";
import { WorkspacesModel } from "../../models/synkro/workspaces.model";
import { UsersModel } from "../../models/users_model/users.model";
import { UserType } from "../../type/users/users.type";

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

export const getAllWorkspaceMembersService = async (workspaceId: string) => {
  const workspaceMembers = await db
    .select()
    .from(WorkspaceMembersModel)
    .innerJoin(
      WorkspacesModel,
      and(
        isNull(WorkspacesModel.deletedAt),
        eq(WorkspacesModel.id, WorkspaceMembersModel.workspaceId)
      )
    )
    .innerJoin(
      UsersModel,
      and(
        isNull(UsersModel.deletedAt),
        eq(UsersModel.id, WorkspaceMembersModel.userId)
      )
    )
    .where(
      and(
        isNull(WorkspaceMembersModel.deletedAt),
        eq(WorkspaceMembersModel.invitationStatus, "accepted"),
        eq(WorkspaceMembersModel.workspaceId, workspaceId)
      )
    );
  return workspaceMembers;
};

export const getWorkspaceMembersService = async (userId: string) => {
  const workspaceMembers = await db
    .select()
    .from(WorkspaceMembersModel)
    .innerJoin(
      WorkspacesModel,
      and(
        isNull(WorkspacesModel.deletedAt),
        eq(WorkspacesModel.id, WorkspaceMembersModel.workspaceId)
      )
    )
    .innerJoin(
      UsersModel,
      and(
        isNull(UsersModel.deletedAt),
        eq(UsersModel.id, WorkspaceMembersModel.userId)
      )
    )
    .where(
      and(
        isNull(WorkspaceMembersModel.deletedAt),
        eq(WorkspaceMembersModel.invitationStatus, "accepted"),
        eq(WorkspaceMembersModel.userId, userId)
      )
    );
  return workspaceMembers;
};

export const deleteWorkspaceMemberService = async (
  userId: string,
  workspaceId: string
) => {
  const data = { deletedAt: new Date(), workspaceId: workspaceId };
  const [deletedMember] = await db
    .update(WorkspaceMembersModel)
    .set(data)
    .where(eq(WorkspaceMembersModel.userId, userId))
    .returning();
  return deletedMember;
};
