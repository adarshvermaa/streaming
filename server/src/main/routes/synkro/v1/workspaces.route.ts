import { Router } from "express";
import workspacesController from "../../../controllers/synkro_controller/workspaces.controller";
import { authrization } from "../../../../middileware/auth.middlerware";

const WorkspacesRouter = Router();

WorkspacesRouter.post('/', authrization, workspacesController.createWorkspace);
WorkspacesRouter.put('/', authrization, workspacesController.updateWorkspace);
WorkspacesRouter.get('/all', authrization, workspacesController.getAllWorkspace);
WorkspacesRouter.get('/:workspace_id', authrization, workspacesController.getWorkspace);
WorkspacesRouter.delete('/:workspace_id', authrization, workspacesController.deleteWorkspace);

export default WorkspacesRouter;