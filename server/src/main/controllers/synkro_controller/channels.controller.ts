import { NextFunction, Request, Response } from "express";
import { UserType } from "../../type/users/users.type";
import { channelServices } from "../../services/synkro/channel.services";
import { errorHandler } from "../../../middileware/errorHandler";

class ChannelController {
  async createChannel(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { workspaceId, body, user } = req;
      const channel = await channelServices.createChannel(
        body,
        workspaceId,
        user
      );
      res.status(201).json(channel);
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }

  async updateChannel(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        params: { channelId },
        body,
        user,
        workspaceId,
      } = req;
      const channel = await channelServices.updateChannel(
        channelId,
        body,
        user,
        workspaceId
      );
      res.json(channel);
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }

  async getChannel(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const channel = await channelServices.getChannel(
        req.params.channelId,
        req.user as UserType
      );
      if (!channel) {
        res.status(404).send({ message: "Channel not found" });
        return;
      }
      res.status(200).send({ channel, message: "Channel found successfully" });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }

  async getAllChannels(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { user, workspaceId, query } = req;
      const channels = await channelServices.getAllChannels(
        user,
        workspaceId,
        query
      );
      if (!channels) {
        res.status(404).send({
          message: "No channels found",
        });
        return;
      }
      res.status(200).send({
        channels,
        message: "Channels fetched successfully",
      });
      return;
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }

  async deleteChannel(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await channelServices.deleteChannel(
        req.params.channelId,
        req.user as UserType
      );
      res.json(result);
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }
}

export default new ChannelController();
