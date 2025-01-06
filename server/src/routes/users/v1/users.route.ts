import { Router, Request, Response } from 'express';
import registerController from '../../../controllers/usersController/register.controller';

const router = Router();

// Define route for /users
router.post('/', registerController.register);


export default router;