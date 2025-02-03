import { Router } from "express";
import WorkspaceMembersController from "../../../controllers/synkro_controller/workspaces_member.controller";
import {
  authrization,
  isBlongToWorkspace,
} from "../../../../middileware/auth.middlerware";

const WorkspacesMemberRouter = Router();

WorkspacesMemberRouter.post(
  "/invite",
  authrization,
  isBlongToWorkspace,
  WorkspaceMembersController.inviteWorkspaceMember
);
WorkspacesMemberRouter.get(
  "/accept-invitation/:token",
  authrization,
  isBlongToWorkspace,
  WorkspaceMembersController.acceptInvitation
);
export default WorkspacesMemberRouter;
