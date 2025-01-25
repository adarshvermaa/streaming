import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { ERROR } from "../../../constant/errorHandler/errorManagement";
import { SUCCESS } from "../../../constant/successHandler/successManagement";
import { createNewUser, getUserByEmailOrUsername, isValidUser, resetPassword, updateDynamicUser } from "../../services/user_services/user.services";
import { UserType } from "../../type/users/users.type";
import { decodeToken, generateToken } from "../../../utils/jwt/jwt.utils";
import { sendEmail } from "../../../utils/mail/nodeMailer";
import { ENV } from "../../../config/env";



class RegisterController {
    public async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, name, username } = req.body as UserType;
            // Check if the email or username already exists
            const existingUser = await isValidUser({ email, username });
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
                    if (decoded.verifyEmail) {
                        newUser = await updateDynamicUser(decoded.email, { isEmailVerifiedAt: new Date() }) as UserType | null;
                    }
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
                {
                    name,
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

            let updatedUser: UserType | null = null;

            if (name || publicName || avatarUrl || coverUrl || bio || phone || externalUrl) {
                updatedUser = await updateDynamicUser(user.email, { name, publicName, avatarUrl, coverUrl, bio, phone, externalUrl }) as UserType | null;
            }
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 15);
                updatedUser = await updateDynamicUser(user.email, { password: hashedPassword }) as UserType | null;
            }
            if (email) {
                const token = generateToken({ email, verifyEmail: true, expiresIn: '1d' });
                sendEmail(email, 'Email Verification', 'Please verify your email', `<a href="${ENV.FRONTEND_URL}/veryfy-email?token=${token}">Verify Email</a>`);
                res.status(201).send({
                    message: SUCCESS.EMAIL_SENT,
                    status: true,
                    code: 201,
                    data: token,
                });
                return
            }
            if (username) {
                const existingUser = await isValidUser({ email, username });
                if (existingUser) {
                    res.status(400).send({ message: existingUser, status: false, code: 400 });
                    return;
                }
                updatedUser = await updateDynamicUser(user.email, { username }) as UserType | null;
            }
            if (!updatedUser) {
                res.status(404).send({ message: ERROR.NOT_FOUND, status: false, code: 404 });
                return;
            } else {
                res.status(200).send({
                    message: SUCCESS.USER_UPDATED, status: true, code: 200, data: updatedUser
                });
            }
        } catch (error) {
            res.status(500).send({
                message: ERROR.SERVER_ERROR, status: false, code: 500, error: error
            });
        }
    }
    public async logout(req: Request & { logout: (callback: (err: any) => void) => void }, res, next): Promise<void> {
        req.logout((err) => {
            if (err) return next(err);
            res.redirect('/');
        });
    }
}

export default new RegisterController();
