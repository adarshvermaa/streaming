import { Router } from 'express';
import registerController from '../../../controllers/users_controller/user.controller';
import { authrization } from '../../../../middileware/auth.middlerware';
import { zodValidator } from '../../../../middileware/zod.middleware';
import { userForgetPasswordSchema, userLoginSchema, userRegisterSchema, userResetPasswordSchema, userUpdateSchema } from '../../../zod_schemas/users_schemas/user.schemas';

const UserRouter = Router();

// Define route for /users
UserRouter.post('/', zodValidator(userRegisterSchema), registerController.register);
UserRouter.get('/email-veryfication', registerController.veryficationsEmail);
UserRouter.post('/forget-password', zodValidator(userForgetPasswordSchema), registerController.forgetPassword);
UserRouter.post('/reset-password', zodValidator(userResetPasswordSchema), registerController.resetPassword);
UserRouter.post('/login', zodValidator(userLoginSchema), registerController.loginUser);
UserRouter.put('/user-update', authrization, zodValidator(userUpdateSchema), registerController.updateUser);
UserRouter.get('/logout', registerController.logout);

export default UserRouter;