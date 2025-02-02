import { Router } from "express";

const ChannelsMemberRouter = Router();

ChannelsMemberRouter.get('/', (req, res) => {
    res.send('Hello World');
});
export default ChannelsMemberRouter;