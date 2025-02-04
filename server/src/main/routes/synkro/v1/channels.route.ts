import { Router } from "express";

const ChannelsRouter = Router();

ChannelsRouter.get("/", (req, res) => {
  res.send("Hello World");
});
export default ChannelsRouter;
