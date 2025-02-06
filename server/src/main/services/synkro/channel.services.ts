import db from "../../../config/database/database";
import { WorkspaceMembersModel } from "../../models/synkro/workspace_members.model";
import { eq, and, sql, isNull, or } from "drizzle-orm";
import { UserType } from "../../type/users/users.type";
import { ChannelsModel } from "../../models/synkro/channel.model";
import { UsersModel } from "../../models/users_model/users.model";
import { WorkspacesModel } from "../../models/synkro/workspaces.model";

export const channelServices = {
  async createChannel(body: any, workspaceId: string, user: UserType) {
    return db.transaction(async (tx) => {
      // Check workspace membership
      const [userType] = await tx
        .select({
          workspaceId: WorkspacesModel.id,
          userId: WorkspacesModel.createdBy,
          userType: UsersModel.userType,
        })
        .from(UsersModel)
        .innerJoin(
          WorkspacesModel,
          and(
            eq(WorkspacesModel.createdBy, UsersModel.id),
            isNull(WorkspacesModel.deletedAt)
          )
        )
        .where(
          and(
            eq(UsersModel.userType, "teacher"),
            eq(UsersModel.id, user.id),
            isNull(WorkspacesModel.deletedAt)
          )
        );

      if (userType?.userType !== "teacher") {
        throw new Error("User is not a teacher of this workspace");
      }
      // Create channel
      const [channel] = await tx
        .insert(ChannelsModel)
        .values({
          ...body,
          workspaceId,
          createdBy: user.id,
        })
        .returning();
      return channel;
    });
  },

  async updateChannel(
    channelId: string,
    body: any,
    user: UserType,
    workspaceId: string
  ) {
    return db.transaction(async (tx) => {
      // Verify channel ownership
      const [existing] = await tx
        .select({
          id: ChannelsModel.id,
          createdBy: ChannelsModel.createdBy,
          workspaceId: ChannelsModel.workspaceId,
        })
        .from(ChannelsModel)
        .where(
          and(
            eq(ChannelsModel.id, channelId),
            eq(ChannelsModel.createdBy, user.id),
            eq(ChannelsModel.workspaceId, workspaceId)
          )
        );

      if (!existing) {
        throw new Error("Channel not found or unauthorized");
      }

      const [channel] = await tx
        .update(ChannelsModel)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(ChannelsModel.id, channelId))
        .returning();

      return channel;
    });
  },

  async getChannel(channelId: string, user: UserType) {
    const [channel] = await db
      .select({
        id: ChannelsModel.id,
        workspaceId: ChannelsModel.workspaceId,
        name: ChannelsModel.name,
        description: ChannelsModel.description,
        isPrivate: ChannelsModel.isPrivate,
        createdAt: ChannelsModel.createdAt,
        updatedAt: ChannelsModel.updatedAt,
      })
      .from(ChannelsModel)
      .innerJoin(
        WorkspaceMembersModel,
        and(
          eq(WorkspaceMembersModel.workspaceId, ChannelsModel.workspaceId),
          or(
            eq(WorkspaceMembersModel.role, "admin"),
            eq(WorkspaceMembersModel.userId, user.id)
          )
        )
      )
      .where(
        and(
          isNull(ChannelsModel.deleteAt),
          eq(ChannelsModel.id, channelId),
          sql`${ChannelsModel.isPrivate} = false OR ${WorkspaceMembersModel.userId} IS NOT NULL`
        )
      );

    if (!channel) {
      throw new Error("Channel not found or access denied");
    }

    return channel;
  },

  async getAllChannels(
    user: UserType,
    workspaceId: string,
    query: {
      page?: number;
      limit?: number;
      isPrivate?: boolean;
    }
  ) {
    const { page, limit, isPrivate = false } = query;
    const pages = Number(page) || 1;
    const limits = Number(limit) || 5;
    const offset = (pages - 1) * limits;

    return db
      .select()
      .from(ChannelsModel)
      .where(
        and(
          isNull(ChannelsModel.deleteAt),
          eq(ChannelsModel.workspaceId, workspaceId),
          isPrivate !== undefined
            ? eq(ChannelsModel.isPrivate, isPrivate)
            : sql`true`,
          sql`${ChannelsModel.isPrivate} = false OR EXISTS (
            SELECT 1 FROM ${WorkspaceMembersModel}
            WHERE ${WorkspaceMembersModel.workspaceId} = ${workspaceId}
            AND ${WorkspaceMembersModel.userId} = ${user.id}
          )`
        )
      )
      .orderBy(ChannelsModel.createdAt)
      .limit(limits)
      .offset(offset);
  },

  async deleteChannel(channelId: string, user: UserType) {
    return db.transaction(async (tx) => {
      // Verify ownership or admin status
      const [channel] = await tx
        .select({
          channelName: ChannelsModel.name,
        })
        .from(ChannelsModel)
        .leftJoin(
          WorkspaceMembersModel,
          and(
            eq(WorkspaceMembersModel.workspaceId, ChannelsModel.workspaceId),
            eq(WorkspaceMembersModel.userId, user.id)
          )
        )
        .where(
          and(
            eq(ChannelsModel.id, channelId),
            sql`${ChannelsModel.createdBy} = ${user.id} OR ${WorkspaceMembersModel.role} = 'admin'`
          )
        );

      if (!channel) {
        throw new Error("Channel not found or unauthorized");
      }
      const data = {
        deleteAt: new Date(),
        name: channel.channelName,
      };
      await tx
        .update(ChannelsModel)
        .set(data)
        .where(eq(ChannelsModel.id, channelId));

      return { success: true };
    });
  },
};
