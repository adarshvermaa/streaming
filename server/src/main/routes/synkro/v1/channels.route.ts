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
  authrization,
  isBlongToWorkspace,
  zodValidator(CreateChannelSchema),
  channelsController.createChannel
);
ChannelsRouter.put(
  "/:channelId",
  authrization,
  authrization,
  isBlongToWorkspace,
  zodValidator(UpdateChannelSchema),
  channelsController.updateChannel
);
ChannelsRouter.get(
  "/all",
  authrization,
  authrization,
  isBlongToWorkspace,
  channelsController.getAllChannels
);
ChannelsRouter.get(
  "/:channelId",
  authrization,
  authrization,
  isBlongToWorkspace,
  channelsController.getChannel
);
ChannelsRouter.delete(
  "/:channelId",
  authrization,
  authrization,
  isBlongToWorkspace,
  channelsController.deleteChannel
);
export default ChannelsRouter;
