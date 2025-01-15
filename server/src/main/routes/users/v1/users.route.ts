import { Router, Request, Response } from 'express';
import registerController from '../../../controllers/users_controller/user.controller';
import { authrization } from '../../../../middileware/auth.middlerware';
import { zodValidator } from '../../../../middileware/zod.middleware';
import { userRegisterSchema, userUpdateSchema } from '../../../zod_schemas/users_schemas/user.schemas';

const router = Router();

// Define route for /users
router.post('/', zodValidator(userRegisterSchema), registerController.register);
router.get('/email-veryfication', registerController.veryficationsEmail);
router.post('/forget-password', registerController.forgetPassword);
router.post('/reset-password', registerController.resetPassword);
router.post('/login', registerController.loginUser);
router.put('/user-update', authrization, zodValidator(userUpdateSchema), registerController.updateUser);

export default router;