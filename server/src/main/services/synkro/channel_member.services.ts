import { UserType } from "../../type/users/users.type";
import db from "../../../config/database/database";
import { ChannelsModel } from "../../models/synkro/channel.model";
import { and, eq, isNull } from "drizzle-orm";
import { WorkspacesModel } from "../../models/synkro/workspaces.model";
import { ChannelMembersModel } from "../../models/synkro/channel_member.model";

export const crerateChannelMemberServices = async (
  workspaceId: string,
  channelId: string,
  user: UserType
) => {
  const result = await db.transaction(async (trx) => {
    const [existingChannels] = await trx
      .select({
        channelId: ChannelsModel.id,
      })
      .from(ChannelsModel)
      .innerJoin(
        WorkspacesModel,
        eq(ChannelsModel.workspaceId, WorkspacesModel.id)
      )
      .where(
        and(
          eq(WorkspacesModel.id, workspaceId),
          eq(ChannelsModel.id, channelId),
          isNull(ChannelsModel.deleteAt),
          isNull(WorkspacesModel.deletedAt)
        )
      );
    if (!existingChannels) {
      throw new Error("channel not found");
    }

    await trx.insert(ChannelMembersModel).values({
      channelId,
      userId: user.id,
    });
    return existingChannels;
  });
  return result;
};

export const getAllChannelMemberServices = async (
  workspaceId: string,
  channelId: string,
  query: {
    limit: number;
    page: number;
  }
) => {
  const { limit, page } = query;
  const limits = Number(limit);
  const pages = Number(page);
  const offset = (pages - 1) * limits;
  const result = await db.transaction(async (trx) => {
    const existingChannels = await trx
      .select()
      .from(ChannelMembersModel)
      .innerJoin(
        ChannelsModel,
        eq(ChannelsModel.id, ChannelMembersModel.channelId)
      )
      .innerJoin(
        WorkspacesModel,
        eq(ChannelsModel.workspaceId, WorkspacesModel.id)
      )
      .where(
        and(
          eq(WorkspacesModel.id, workspaceId),
          eq(ChannelMembersModel.channelId, channelId),
          isNull(ChannelsModel.deleteAt),
          isNull(WorkspacesModel.deletedAt)
        )
      )
      .limit(limits)
      .offset(offset);
    return existingChannels;
  });
  return result;
};

export const getChannelMemberServices = async (
  workspaceId: string,
  channelId: string,
  user: UserType
) => {
  const result = await db.transaction(async (trx) => {
    const [existingChannels] = await trx
      .select()
      .from(ChannelMembersModel)
      .innerJoin(
        ChannelsModel,
        eq(ChannelsModel.id, ChannelMembersModel.channelId)
      )
      .innerJoin(
        WorkspacesModel,
        eq(ChannelsModel.workspaceId, WorkspacesModel.id)
      )
      .where(
        and(
          eq(WorkspacesModel.id, workspaceId),
          eq(ChannelMembersModel.channelId, channelId),
          eq(ChannelMembersModel.userId, user.id),
          isNull(ChannelsModel.deleteAt),
          isNull(WorkspacesModel.deletedAt)
        )
      );
    return existingChannels;
  });
  return result;
};
