import { Request, Response } from "express";
import { eq, is } from "drizzle-orm";
import db from "../../config/database/database"; // Drizzle database instance
import bcrypt from "bcrypt";
import { UsersModel } from "../../models/users/users";
import { ERROR } from "../../constant/errorHandler/errorManagement";
import { SUCCESS } from "../../constant/successHandler/successManagement";
import { createNewUser, isValidUser } from "../../services/userServices/user.services";
import { UserType } from "../../type/users/users.type";

class RegisterController {
    public async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, name, username } = req.body as UserType;

            // Validate required fields
            if (!email || !password || !name || !username) {
                res.status(400).send({ message: ERROR.ALL_FIELDS_REQUIRED, Status: false, code: 400 });
                return;
            }

            // Check if the email or username already exists
            const existingUser = await isValidUser(email, username);

            if (existingUser) {
                res.status(400).send({ message: existingUser, status: false, code: 400 });
                return;
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 15);
            const newUser = await createNewUser({ email, password: hashedPassword, name, username });

            // Send success response
            res.status(201).send({
                message: SUCCESS.USER_REGISTERED,
                status: true,
                code: 201,
                data: newUser,
            });
        } catch (error) {
            console.error("Error in RegisterController.register:", error);
            res.status(500).send({ message: ERROR.SERVER_ERROR, status: false, code: 500, error: error });
        }
    }
}

export default new RegisterController();
