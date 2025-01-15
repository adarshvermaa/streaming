import { z } from "zod";

// Define Zod schemas
export const userRegisterSchema = z.object({
    name: z
        .string()
        .min(1, "Name cannot be empty.")
        .max(50, "Name must not exceed 50 characters."),
    email: z
        .string()
        .regex(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Invalid email format. Please use a valid email address."
        ),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters long.")
        .max(20, "Username must not exceed 20 characters.")
        .regex(
            /^[a-zA-Z0-9_.]{3,20}$/,
            "Username can only contain letters, numbers, underscores (_), or periods (.)"
        ),
    password: z
        .string()
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character."
        ),
});

export const userUpdateSchema = z.object({
    name: z
        .string()
        .min(1, "Name cannot be empty.")
        .max(50, "Name must not exceed 50 characters.")
        .optional(),
    publicName: z
        .string()
        .min(1, "Public Name cannot be empty.")
        .max(50, "Public Name must not exceed 50 characters.")
        .optional(),
    email: z
        .string()
        .regex(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Invalid email format. Please use a valid email address."
        )
        .optional(),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters long.")
        .max(20, "Username must not exceed 20 characters.")
        .regex(
            /^[a-zA-Z0-9_.]{3,20}$/,
            "Username can only contain letters, numbers, underscores (_), or periods (.)"
        )
        .optional(),
    password: z
        .string()
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character."
        )
        .optional(),
    avatarUrl: z
        .string()
        .url("Avatar URL must be a valid URL.")
        .optional(),
    coverUrl: z
        .string()
        .url("Cover URL must be a valid URL.")
        .optional(),
    bio: z
        .string()
        .max(160, "Bio must not exceed 160 characters.")
        .optional(),
    phone: z
        .string()
        .regex(
            /^\+?[1-9]\d{1,14}$/,
            "Phone number must be a valid international format (e.g., +1234567890)."
        )
        .optional(),
    externalUrl: z
        .array(z.string().url("Invalid URL format. Please provide a valid URL."))
        .optional(),
});


export const userLoginSchema = z.object({
    emailOrUsername: z
        .string()
        .refine((value) => {
            // Check if the value is a valid email
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const usernamePattern = /^[a-zA-Z0-9_.]{3,20}$/;
            return emailPattern.test(value) || usernamePattern.test(value);
        }, "Invalid email or username format. Please provide a valid email or username."),
    password: z
        .string()
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character."
        ),
});

export const userForgetPasswordSchema = z.object({
    emailOrUsername: z
        .string()
        .refine((value) => {
            // Check if the value is a valid email
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const usernamePattern = /^[a-zA-Z0-9_.]{3,20}$/;
            return emailPattern.test(value) || usernamePattern.test(value);
        }, "Invalid email or username format. Please provide a valid email or username."),
});

export const userResetPasswordSchema = z.object({
    password: z
        .string()
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character."
        ),
});