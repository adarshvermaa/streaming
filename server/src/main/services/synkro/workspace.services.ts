import { WorkspacesModel } from "../../models/synkro/workspaces.model";
import db from "../../../config/database/database";
import {
  IWorkspace,
  UWorkspace,
} from "../../type/users/synkro/workspaces.type";
import { and, eq, isNull } from "drizzle-orm";
import { UserType } from "../../type/users/users.type";

export const generateSlug = (text) => {
  return text
    .toString() // Ensure the input is a string
    .toLowerCase() // Convert to lower case
    .trim() // Remove whitespace from both ends
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars (letters, numbers, underscores, and hyphens)
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from the start
    .replace(/-+$/, ""); // Trim - from the end
};

export const createWorkspaceServices = async (
  { name, description, logoUrl, bannerUrl, websiteUrl }: IWorkspace,
  user: UserType
): Promise<IWorkspace> => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = {
        name,
        description,
        createdBy: user.id,
        slug: generateSlug(name),
        logoUrl,
        bannerUrl,
        websiteUrl,
      };
      const [newWorkspace] = await db
        .insert(WorkspacesModel)
        .values(data)
        .returning();
      resolve(newWorkspace);
    } catch (error) {
      console.error("Error in createWorkspace:", error);
      reject(error);
    }
  });
};

export const updateWorkspaceServices = async (
  workspace: UWorkspace,
  user: UserType
): Promise<UWorkspace> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, description, logoUrl, bannerUrl, websiteUrl } = workspace;
      const data = {
        name,
        description,
        slug: generateSlug(name),
        logoUrl,
        bannerUrl,
        websiteUrl,
      };
      const [newWorkspace] = await db
        .update(WorkspacesModel)
        .set(data)
        .where(
          and(
            eq(WorkspacesModel.createdBy, user.id),
            isNull(WorkspacesModel.deletedAt)
          )
        )
        .returning();
      resolve(newWorkspace);
    } catch (error) {
      console.error("Error in updateWorkspace:", error);
      reject(error);
    }
  });
};

export const getWorkspaceServices = async (
  workspace_id: string
): Promise<IWorkspace> => {
  return new Promise(async (resolve, reject) => {
    try {
      const [getWorkspace] = await db
        .select()
        .from(WorkspacesModel)
        .where(
          and(
            eq(WorkspacesModel.id, workspace_id),
            isNull(WorkspacesModel.deletedAt)
          )
        );
      resolve(getWorkspace);
    } catch (error) {
      console.error("Error in getWorkspace:", error);
      reject(error);
    }
  });
};

export const getAllWorkspaceServices = async (
  user_id: string
): Promise<IWorkspace[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const getWorkspace = await db
        .select()
        .from(WorkspacesModel)
        .where(
          and(
            eq(WorkspacesModel.createdBy, user_id),
            isNull(WorkspacesModel.deletedAt)
          )
        );
      resolve(getWorkspace);
    } catch (error) {
      console.error("Error in getAllWorkspace:", error);
      reject(error);
    }
  });
};
export const deleteWorkspaceServices = async (workspace_id: string) => {
  const data = {
    deletedAt: new Date(),
  };

  try {
    const deleteWorkspace = await db
      .update(WorkspacesModel)
      .set(data as any) // Cast to any to satisfy TypeScript
      .where(eq(WorkspacesModel.id, workspace_id))
      .returning();
    return deleteWorkspace;
  } catch (error) {
    console.error("Error in deleteWorkspace:", error);
    throw error;
  }
};
