import { Router, Request, Response } from 'express';
import registerController from '../../../controllers/usersController/user.controller';
import { authrization } from '../../../middileware/auth.middlerware';

const router = Router();

// Define route for /users
router.post('/', registerController.register);
router.get('/email-veryfication', registerController.veryficationsEmail);
router.post('/forget-password', registerController.forgetPassword);
router.post('/reset-password', registerController.resetPassword);
router.post('/login', registerController.loginUser);
router.put('/user-update', authrization, registerController.updateUser);


export default router;