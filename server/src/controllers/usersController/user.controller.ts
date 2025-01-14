import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { ERROR } from "../../constant/errorHandler/errorManagement";
import { SUCCESS } from "../../constant/successHandler/successManagement";
import { createNewUser, getUserByEmailOrUsername, isValidUser, resetPassword } from "../../services/userServices/user.services";
import { UserType } from "../../type/users/users.type";
import { decodeToken, generateToken } from "../../utils/jwt/jwt.utils";
import { sendEmail } from "../../utils/mail/nodeMailer";
import { ENV } from "../../config/env";
import { validatePassword } from "../../utils/kit/rgxPattern.kit";

class RegisterController {
    public async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, name, username } = req.body as UserType;

            // Validate required fields
            if (!email || !password || !name || !username) {
                res.status(400).send({ message: ERROR.ALL_FIELDS_REQUIRED, Status: false, code: 400 });
                return;
            }
            const checkPasswordFromat = validatePassword(password);
            if (checkPasswordFromat !== "strong") {
                res.status(400).send({ message: checkPasswordFromat, status: false, code: 400 });
                return
            }


            // Check if the email or username already exists
            const existingUser = await isValidUser(email, username);

            if (existingUser) {
                res.status(400).send({ message: existingUser, status: false, code: 400 });
                return;
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 15);
            const token = generateToken({ email, password: hashedPassword, name, username, expiresIn: '1d' });
            sendEmail(email, 'Email Verification', 'Please verify your email', `<a href="${ENV.FRONTEND_URL}/veryfy-email?token=${token}">Verify Email</a>`);

            // Send success response
            res.status(201).send({
                message: SUCCESS.EMAIL_SENT,
                status: true,
                code: 201,
                data: token,
            });
        } catch (error) {
            res.status(500).send({ message: ERROR.SERVER_ERROR, status: false, code: 500, error: error });
        }
    }
    public async veryficationsEmail(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.query;
            if (!token) {
                res.status(400).send({ message: ERROR.TOKEN_REQUIRED, status: false, code: 400 });
                return;
            }
            const decoded = decodeToken(token as string) as { [key: string]: any };
            const currentTimestamp = Math.floor(Date.now() / 1000);
            let newUser;
            if (decoded) {
                if (currentTimestamp > decoded.exp) {
                    res.status(400).send({ message: ERROR.TOKEN_EXPIRED, status: false, code: 400 });
                    return;
                } else {
                    newUser = await createNewUser({
                        email: decoded.email, password: decoded.password, name: decoded.name, username: decoded.username, isEmailVerifiedAt: new Date()
                    });
                }
            } else {
                res.status(400).send({ message: ERROR.INVALID_TOKEN, status: false, code: 400 });
                return;
            }
            res.status(200).send({
                message: SUCCESS.EMAIL_VERIFIED, status: true, code: 200, data: newUser
            });

        } catch (error) {
            res.status(500).send({
                message: ERROR.SERVER_ERROR, status: false, code: 500, error: error
            });

        }
    }
    public async forgetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { emailOrUsername } = req.body;
            if (!emailOrUsername) {
                res.status(400).send({ message: ERROR.ALL_FIELDS_REQUIRED, Status: false, code: 400 });
                return;
            }
            const user: UserType | null = await getUserByEmailOrUsername(emailOrUsername as string) as UserType | null;
            if (!user) {
                res.status(404).send({ message: ERROR.NOT_FOUND, status: false, code: 404 });
                return;
            }
            const token = generateToken({ email: user.email, expiresIn: '1d' });
            sendEmail(user.email, 'Password Reset', 'You can Reset now', `<a href="${ENV.FRONTEND_URL}/reset-password?token=${token}">Reset Password</a>`);
            res.status(200).send({ message: SUCCESS.EMAIL_SENT, status: true, code: 200, data: token });
        } catch (error) {
            res.status(500).send({
                message: ERROR.SERVER_ERROR, status: false, code: 500, error: error
            });
        }

    }
    public async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.query;
            const { password } = req.body;
            if (!token) {
                res.status(400).send({ message: ERROR.TOKEN_REQUIRED, status: false, code: 400 });
                return;
            }
            const decoded = decodeToken(token as string) as { [key: string]: any };
            const currentTimestamp = Math.floor(Date.now() / 1000);
            let newUser;
            if (decoded) {
                if (currentTimestamp > decoded.exp) {
                    res.status(400).send({ message: ERROR.TOKEN_EXPIRED, status: false, code: 400 });
                    return;
                } else {
                    const checkPasswordFromat = validatePassword(password);
                    if (checkPasswordFromat !== "strong") {
                        res.status(400).send({ message: checkPasswordFromat, status: false, code: 400 });
                        return
                    }
                    const hashedPassword = await bcrypt.hash(password, 15);
                    newUser = await resetPassword(decoded.email as string, hashedPassword);
                }
            } else {
                res.status(400).send({ message: ERROR.INVALID_TOKEN, status: false, code: 400 });
                return;
            }
            res.status(200).send({
                message: SUCCESS.PASSWORD_RESET, status: true, code: 200, data: newUser
            });

        } catch (error) {
            res.status(500).send({
                message: ERROR.SERVER_ERROR, status: false, code: 500, error: error
            });
        }
    }
    public async loginUser(req: Request, res: Response): Promise<void> {
        try {
            const { emailOrUsername, password } = req.body;
            if (!emailOrUsername || !password) {
                res.status(400).send({ message: ERROR.ALL_FIELDS_REQUIRED, status: false, code: 400 });
                return;
            }
            const user: UserType | null = await getUserByEmailOrUsername(emailOrUsername as string) as UserType | null;
            if (!user) {
                res.status(404).send({ message: ERROR.INVALID_CREDENTIAL, status: false, code: 404 });
                return;
            }
            const isPasswordValid = await bcrypt.compare(password, user.password as string);
            if (isPasswordValid) {
                const token = generateToken({ user, expiresIn: '1y' });
                res.status(200).send({ message: SUCCESS.USER_LOGGED_IN, status: true, code: 200, data: token });
            } else {
                res.status(400).send({ message: ERROR.INVALID_PASSWORD, status: false, code: 400 });
                return;
            }
        } catch (error) {
            res.status(500).send({
                message: ERROR.SERVER_ERROR, status: false, code: 500, error: error
            });
        }
    }
    public async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const { body:
                { name,
                    publicName,
                    email,
                    username,
                    password,
                    avatarUrl,
                    coverUrl,
                    bio,
                    phone,
                    externalUrl,
                },
                user
            } = req;

        } catch (error) {
            res.status(500).send({
                message: ERROR.SERVER_ERROR, status: false, code: 500, error: error
            });
        }
    }
}

export default new RegisterController();
