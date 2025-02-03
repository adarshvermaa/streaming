import { Request, Response, NextFunction } from "express";
import {
  acceptInvitationService,
  createWorkspaceInvitationService,
} from "../../services/synkro/workspace_member.services";
import { errorHandler } from "../../../middileware/errorHandler";

class WorkspaceMembersController {
  public async inviteWorkspaceMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        workspaceId,
        body: { userId: invitedUserId },
      } = req;
      const invitedBy = req.user.id;

      if (!workspaceId || !invitedUserId) {
        res.status(400).send({
          error: "Workspace ID and User ID are required",
        });
        return;
      }

      const { invitationLink, expiresAt, errorMassage } =
        await createWorkspaceInvitationService(
          workspaceId,
          invitedUserId,
          invitedBy
        );

      if (errorMassage) {
        res.status(400).send({
          error: errorMassage,
        });
        return;
      }

      res.status(201).send({
        message: "Invitation sent successfully",
        invitationLink,
        expiresAt,
      });
      return;
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }

  public async acceptInvitation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token } = req.params;
      const updatedMember = await acceptInvitationService(token);

      res.status(200).send({
        message: "Invitation accepted successfully",
        workspaceId: updatedMember.workspaceId,
        userId: updatedMember.userId,
      });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }
}

export default new WorkspaceMembersController();
