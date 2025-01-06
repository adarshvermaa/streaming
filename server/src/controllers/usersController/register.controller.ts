import { Request, Response } from 'express';
import db from '../../config/database/database';
import { UsersModel } from '../../models/users/users';

class RegisterController {
    public async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, name } = req.body;
            console.log('RegisterController.register', req.body);
        } catch (error) {
            res.status(400).json({ message: "error.message" });
        }
    }
}
export default new RegisterController();