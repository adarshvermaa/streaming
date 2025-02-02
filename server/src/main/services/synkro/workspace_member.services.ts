// import { WorkspaceMembersModel } from "../../models/synkro/workspace_members.model";
// import { IWorkspaceMember } from "../../type/users/synkro/workspaces_member.type";
// import db  from "../../../config/database/database";

// export const createWorkspaceMemberServices = async (
//   workspaceMember: IWorkspaceMember
// ): Promise<IWorkspaceMember> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const [newWorkspaceMember] = await db
//         .insert(WorkspaceMembersModel)
//         .values(workspaceMember)
//         .returning();
//       resolve(newWorkspaceMember);
//     } catch (error) {
//       console.error("Error in createWorkspaceMember:", error);
//       reject(error);
//     }
//   });
// };
// export const updateWorkspaceMemberServices = async (
//   workspaceMember: IWorkspaceMember
// ): Promise<IWorkspaceMember> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const [newWorkspaceMember] = await db
//         .insert(WorkspaceMembersModel)
//         .values(workspaceMember)
//         .returning();
//       resolve(newWorkspaceMember);
//     } catch (error) {
//       console.error("Error in createWorkspaceMember:", error);
//       reject(error);
//     }
//   });
// };
// export const getWorkspaceMemberServices = async (
//   workspaceMember: IWorkspaceMember
// ): Promise<IWorkspaceMember> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const [newWorkspaceMember] = await db
//         .insert(WorkspaceMembersModel)
//         .values(workspaceMember)
//         .returning();
//       resolve(newWorkspaceMember);
//     } catch (error) {
//       console.error("Error in createWorkspaceMember:", error);
//       reject(error);
//     }
//   });
// };  
// export const getAllWorkspaceMemberServices = async (
//   workspaceMember: IWorkspaceMember
// ): Promise<IWorkspaceMember> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const [newWorkspaceMember] = await db
//         .insert(WorkspaceMembersModel)
//         .values(workspaceMember)
//         .returning();
//       resolve(newWorkspaceMember);
//     } catch (error) {
//       console.error("Error in createWorkspaceMember:", error);
//       reject(error);
//     }
//   });
// };
// export const deleteWorkspaceMemberServices = async (
//   workspaceMember: IWorkspaceMember
// ): Promise<IWorkspaceMember> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const [newWorkspaceMember] = await db
//         .insert(WorkspaceMembersModel)
//         .values(workspaceMember)
//         .returning();
//       resolve(newWorkspaceMember);
//     } catch (error) {
//       console.error("Error in createWorkspaceMember:", error);
//       reject(error);
//     }
//   });
// };