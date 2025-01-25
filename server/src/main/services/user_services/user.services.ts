import { eq, or } from "drizzle-orm";
import db from "../../../config/database/database";
import { UsersModel } from "../../models/users_model/users.model";
import { GoogleProfile, UserType } from "../../type/users/users.type";
import { ERROR } from "../../../constant/errorHandler/errorManagement";

export const isValidUser = async (params: { [key: string]: string }) => {
    try {
        const { email, username } = params;
        // Check if the email exists
        if (email) {
            const existingUser = await db
                .select({
                    email: UsersModel.email,
                })
                .from(UsersModel)
                .where(eq(UsersModel.email, email))
                .then((result) => result[0]);

            if (existingUser) {
                return ERROR.EMAIL_ALREADY_REGISTERED;
            }
        }

        // Check if the username exists
        if (username) {
            const existingUsername = await db
                .select({
                    username: UsersModel.username,
                })
                .from(UsersModel)
                .where(eq(UsersModel.username, username))
                .then((result) => result[0]);

            if (existingUsername) {
                return ERROR.USERNAME_ALREADY_REGISTERED;
            }
        }

        return null; // No errors
    } catch (error) {
        console.error("Error in isValidUser:", error);
        throw new Error("Validation error occurred");
    }
}


export const createNewUser = async (user: UserType) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Insert the new user into the database
            const newUser = await db.insert(UsersModel).values(user).returning();
            resolve(newUser);
        } catch (error) {
            console.error("Error in createNewUser:", error);
            reject(error);
        }
    })
}
export const getUserByEmailOrUsername = async (emailOrUsername: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.select()
                .from(UsersModel)
                .where(or(eq(UsersModel.username, emailOrUsername), eq(UsersModel.email, emailOrUsername)))
                .then((result) => result[0]);
            resolve(user);
        } catch (error) {
            console.error("Error in getUser:", error);
            reject(error);
        }
    })
}

export const resetPassword = async (email: string, password: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = { password, updatedAt: new Date() }
            const updatedUser = await db.update(UsersModel).set(data).where(eq(UsersModel.email, email)).returning({
                email: UsersModel.email,
                username: UsersModel.username,
                name: UsersModel.name,
                isEmailVerifiedAt: UsersModel.isEmailVerifiedAt,
            });
            resolve(updatedUser);
        } catch (error) {
            console.error("Error in resetPassword:", error);
            reject(error);
        }
    })
}


export const updateDynamicUser = async (email: string, data: { [key: string]: any }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatedUser = await db.update(UsersModel).set(data).where(eq(UsersModel.email, email)).returning();
            resolve(updatedUser);
        } catch (error) {
            console.error("Error in updateDynamicUser:", error);
            reject(error);
        }
    })
}
export const generateUsername = (displayName: string) => {
    return displayName.toLowerCase().replace(/\s+/g, '') + Math.floor(1000 + Math.random() * 9000);
}

export const loginWithGoogle = async (user: GoogleProfile) => {
    const username = generateUsername(user.profile.displayName);
    const data = {
        email: user.profile._json.email,
        publicName: user.profile.displayName,
        username: username,
        name: user.profile.displayName,
        avatarUrl: user.profile._json.picture,
        password: 'google',
        authProvider: 'google',
        isEmailVerifiedAt: new Date(),
    }
    await db.insert(UsersModel).values(data);
};