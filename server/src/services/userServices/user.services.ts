import { eq } from "drizzle-orm";
import db from "../../config/database/database";
import { UsersModel } from "../../models/users/users";
import { UserType } from "../../type/users/users.type";
import { ERROR } from "../../constant/errorHandler/errorManagement";

export const isValidUser = async (email: string, username: string) => {
    try {
        // Check if the email exists
        if (email) {
            const existingUser = await db
                .select()
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
                .select()
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
            const newUser = await db.insert(UsersModel).values(user);
            resolve(newUser);
        } catch (error) {
            console.error("Error in createNewUser:", error);
            reject(error);
        }
    })
}