import { NextFunction, Request, Response } from "express";
import {
  createWorkspaceServices,
  deleteWorkspaceServices,
  getAllWorkspaceServices,
  getWorkspaceServices,
  updateWorkspaceServices,
} from "../../services/synkro/workspace.services";
import { SUCCESS } from "../../../constant/successHandler/successManagement";
import { ERROR } from "../../../constant/errorHandler/errorManagement";
import { errorHandler } from "../../../middileware/errorHandler";

class WorkspacesController {
  public async createWorkspace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { body, user } = req;
      const workspace = await createWorkspaceServices(body, user);
      res.status(201).send({
        message: SUCCESS.CREATE_WORKSPACE,
        workspace,
      });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }
  public async getWorkspace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        params: { workspace_id },
      } = req;
      const getWorkspace = await getWorkspaceServices(workspace_id);
      res.status(201).send({
        message: SUCCESS.GET_WORKSPACE,
        getWorkspace,
      });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }
  public async getAllWorkspace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { user } = req;
      const getALlWorkspace = await getAllWorkspaceServices(user.id);
      res.status(201).send({
        message: SUCCESS.GET_ALL_WORKSPACE,
        getALlWorkspace,
      });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }
  public async updateWorkspace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { body, user } = req;
      const workspaceUpdate = await updateWorkspaceServices(body, user);
      res.status(201).send({
        message: SUCCESS.UPDATE_WORKSPACE,
        workspaceUpdate,
      });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }
  public async deleteWorkspace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        params: { workspace_id },
      } = req;
      const deleteWorkspace = await deleteWorkspaceServices(workspace_id);
      res.status(201).send({
        message: SUCCESS.DELETE_WORKSPACE,
        deleteWorkspace,
      });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }
}

export default new WorkspacesController();
