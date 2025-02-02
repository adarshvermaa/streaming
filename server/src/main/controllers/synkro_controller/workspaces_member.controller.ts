class WorkspaceMembersController {
  public async createMembers(req: Request, res: Response) {
    try {
      const workspaceMember = req.body;
      // const newWorkspaceMember = await createWorkspaceMemberServices(
      //   workspaceMember
      // );
      // return res.status(201).json(newWorkspaceMember);
    } catch (error) {
      console.error("Error in createWorkspaceMember:", error);
      // return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

