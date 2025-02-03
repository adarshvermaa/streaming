import { Router } from "express";
import workspacesController from "../../../controllers/synkro_controller/workspaces.controller";
import { authrization } from "../../../../middileware/auth.middlerware";
import { zodValidator } from "../../../../middileware/zod.middleware";
import {
  AddWorkspaceSchema,
  UpdateWorkspaceSchema,
} from "../../../zod_schemas/workspaces/workspace.schemas";

const WorkspacesRouter = Router();

WorkspacesRouter.post(
  "/",
  authrization,
  zodValidator(AddWorkspaceSchema),
  workspacesController.createWorkspace
);

WorkspacesRouter.put(
  "/",
  authrization,
  zodValidator(UpdateWorkspaceSchema),
  workspacesController.updateWorkspace
);
WorkspacesRouter.get(
  "/all",
  authrization,

  workspacesController.getAllWorkspace
);
WorkspacesRouter.get(
  "/:workspace_id",
  authrization,
  workspacesController.getWorkspace
);
WorkspacesRouter.delete(
  "/:workspace_id",
  authrization,
  workspacesController.deleteWorkspace
);

export default WorkspacesRouter;
