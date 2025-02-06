import { errorHandler } from "../../../middileware/errorHandler";
import { NextFunction, Request, Response } from "express";
import {
  crerateChannelMemberServices,
  getAllChannelMemberServices,
  getChannelMemberServices,
} from "../../services/synkro/channel_member.services";

class ChannelMembersController {
  public async createChannelMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { workspaceId, channelId, user } = req;
      const channelMembers = await crerateChannelMemberServices(
        workspaceId,
        channelId,
        user
      );
      if (!channelMembers) {
        res.status(400).send({
          massege: "Not Found",
        });
        return;
      }
      res.status(200).send({
        channelMembers,
        message: "created Channel member succesfully",
      });
      return;
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }
  public async getAllChannelMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { workspaceId, channelId, query } = req;
      const { limit, page } = query as unknown as {
        limit: number;
        page: number;
      };
      const channelMembers = await getAllChannelMemberServices(
        workspaceId,
        channelId,
        { limit, page }
      );
      if (channelMembers?.length === 0) {
        res.status(400).send({
          massege: "Not Found",
        });
        return;
      }
      res.status(200).send({
        channelMembers,
        message: "get all Channel member succesfully",
      });
      return;
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }
  public async getChannelMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { workspaceId, channelId, user } = req;
      const channelMembers = await getChannelMemberServices(
        workspaceId,
        channelId,
        user
      );
      if (!channelMembers) {
        res.status(400).send({
          massege: "Not Found",
        });
        return;
      }
      res.status(200).send({
        channelMembers,
        message: "get Channel member succesfully",
      });
      return;
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }
}
export default new ChannelMembersController();
