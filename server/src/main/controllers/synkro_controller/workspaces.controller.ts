import { Request, Response } from "express";
import { createWorkspaceServices, deleteWorkspaceServices, getAllWorkspaceServices, getWorkspaceServices, updateWorkspaceServices } from "../../services/synkro/workspace.services";
import { SUCCESS } from "../../../constant/successHandler/successManagement";
import { ERROR } from "../../../constant/errorHandler/errorManagement";

class WorkspacesController {
    public async createWorkspace(req: Request, res: Response): Promise<void> {
        try {
            const { body: {
                name, description
            }, user } = req;
            const workspace = await createWorkspaceServices({
                name,
                description,
                createdBy: user.id,
            });
            res.status(201).send({
                message: SUCCESS.CREATE_WORKSPACE,
                workspace,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
                ERROR: ERROR.CREATE_WORKSPACE,
            });
        }
    }
    public async getWorkspace(req: Request, res: Response): Promise<void> {
        try {
            const { params: { workspace_id } } = req;
            const getWorkspace = await getWorkspaceServices(
                workspace_id
            );
            res.status(201).send({
                message: SUCCESS.GET_WORKSPACE,
                getWorkspace,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
                ERROR: ERROR.GET_WORKSPACE,
            });
        }
    }
    public async getAllWorkspace(req: Request, res: Response): Promise<void> {
        try {
            const { user } = req;
            const getALlWorkspace = await getAllWorkspaceServices(
                user.id
            );
            res.status(201).send({
                message: SUCCESS.GET_ALL_WORKSPACE,
                getALlWorkspace,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
                ERROR: ERROR.GET_ALL_WORKSPACE,
            });
        }
    }
    public async updateWorkspace(req: Request, res: Response): Promise<void> {
        try {
            const { body: {
                name, description
            } } = req;
            const workspaceUpdate = await updateWorkspaceServices({
                name,
                description,
            });
            res.status(201).send({
                message: SUCCESS.UPDATE_WORKSPACE,
                workspaceUpdate,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
                ERROR: ERROR.UPDATE_WORKSPACE,
            });
        }
    }
    public async deleteWorkspace(req: Request, res: Response): Promise<void> {
        try {
            const { params: { workspace_id } } = req;
            const deleteWorkspace = await deleteWorkspaceServices(
                workspace_id
            );
            res.status(201).send({
                message: SUCCESS.DELETE_WORKSPACE,
                deleteWorkspace,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
                ERROR: ERROR.DELETE_WORKSPACE,
            });
        }
    }
}


export default new WorkspacesController();