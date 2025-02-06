import { Router } from "express";
import channelsController from "../../../controllers/synkro_controller/channels.controller";
import {
  authrization,
  isBlongToWorkspace,
} from "../../../../middileware/auth.middlerware";
import { zodValidator } from "../../../../middileware/zod.middleware";
import {
  CreateChannelSchema,
  UpdateChannelSchema,
} from "../../../zod_schemas/channel_schemas/channel.schemas";

const ChannelsRouter = Router();

ChannelsRouter.post(
  "/",
  authrization,
  isBlongToWorkspace,
  zodValidator(CreateChannelSchema),
  channelsController.createChannel
);
ChannelsRouter.put(
  "/:channelId",
  authrization,
  isBlongToWorkspace,
  zodValidator(UpdateChannelSchema),
  channelsController.updateChannel
);
ChannelsRouter.get(
  "/all",
  authrization,
  isBlongToWorkspace,
  channelsController.getAllChannels
);
ChannelsRouter.get(
  "/:channelId",
  authrization,
  isBlongToWorkspace,
  channelsController.getChannel
);
ChannelsRouter.delete(
  "/:channelId",
  authrization,
  isBlongToWorkspace,
  channelsController.deleteChannel
);
export default ChannelsRouter;
