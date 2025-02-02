import { WorkspacesModel } from "../../models/synkro/workspaces.model";
import db from "../../../config/database/database";
import { IWorkspace, UWorkspace } from "../../type/users/synkro/workspaces.type";
import { eq } from "drizzle-orm";

export const createWorkspaceServices = async (workspace: IWorkspace): Promise<IWorkspace> => {
    return new Promise(async (resolve, reject) => {
        try {
            const [newWorkspace] = await db.insert(WorkspacesModel).values(workspace).returning();
            resolve(newWorkspace);
        } catch (error) {
            console.error("Error in createWorkspace:", error);
            reject(error);
        }
    })
}


export const updateWorkspaceServices = async (workspace: UWorkspace): Promise<UWorkspace> => {
    return new Promise(async (resolve, reject) => {
        try {
            const [newWorkspace] = await db.update(WorkspacesModel).set(workspace).returning();
            resolve(newWorkspace);
        } catch (error) {
            console.error("Error in updateWorkspace:", error);
            reject(error);
        }
    })
}

export const getWorkspaceServices = async (workspace_id: string): Promise<IWorkspace> => {
    return new Promise(async (resolve, reject) => {
        try {
            const [getWorkspace] = await db.select().from(WorkspacesModel).where(eq(WorkspacesModel.id, workspace_id));
            resolve(getWorkspace);
        } catch (error) {
            console.error("Error in getWorkspace:", error);
            reject(error);
        }
    })
}

export const getAllWorkspaceServices = async (user_id: string): Promise<IWorkspace[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const getWorkspace = await db.select().from(WorkspacesModel).where(eq(WorkspacesModel.createdBy, user_id));
            resolve(getWorkspace);
        } catch (error) {
            console.error("Error in getAllWorkspace:", error);
            reject(error);
        }
    })
}
export const deleteWorkspaceServices = async (workspace_id: string): Promise<IWorkspace[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const deleteWorkspace = await db.update(WorkspacesModel).set({
                deletedAt: new Date()
            }).where(eq(WorkspacesModel.id, workspace_id)).returning();
            resolve(deleteWorkspace);
        } catch (error) {
            console.error("Error in deleteWorkspace:", error);
            reject(error);
        }
    })
}