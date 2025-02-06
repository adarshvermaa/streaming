import { Router } from "express";
import {
  authrization,
  isBlongToChannels,
  isBlongToWorkspace,
} from "../../../../middileware/auth.middlerware";
import ChannelMembersController from "../../../controllers/synkro_controller/channels_member";

const ChannelsMemberRouter = Router();

ChannelsMemberRouter.post(
  "/",
  authrization,
  isBlongToWorkspace,
  isBlongToChannels,
  // zodValidator(CreateChannelMemberSchema),
  ChannelMembersController.createChannelMember
);

ChannelsMemberRouter.get(
  "/all",
  authrization,
  isBlongToWorkspace,
  isBlongToChannels,
  // zodValidator(CreateChannelMemberSchema),
  ChannelMembersController.getAllChannelMember
);

ChannelsMemberRouter.get(
  "/",
  authrization,
  isBlongToWorkspace,
  isBlongToChannels,
  // zodValidator(CreateChannelMemberSchema),
  ChannelMembersController.getChannelMember
);
export default ChannelsMemberRouter;
