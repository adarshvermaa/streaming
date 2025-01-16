import { Router, Request, Response } from 'express';
import registerController from '../../../controllers/users_controller/user.controller';
import { authrization } from '../../../../middileware/auth.middlerware';
import { zodValidator } from '../../../../middileware/zod.middleware';
import { userForgetPasswordSchema, userLoginSchema, userRegisterSchema, userResetPasswordSchema, userUpdateSchema } from '../../../zod_schemas/users_schemas/user.schemas';

const router = Router();

// Define route for /users
router.post('/', zodValidator(userRegisterSchema), registerController.register);
router.get('/email-veryfication', registerController.veryficationsEmail);
router.post('/forget-password', zodValidator(userForgetPasswordSchema), registerController.forgetPassword);
router.post('/reset-password', zodValidator(userResetPasswordSchema), registerController.resetPassword);
router.post('/login', zodValidator(userLoginSchema), registerController.loginUser);
router.put('/user-update', authrization, zodValidator(userUpdateSchema), registerController.updateUser);

export default router;