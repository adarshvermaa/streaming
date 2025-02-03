import jwt from "jsonwebtoken";
import { ENV } from "../../config/env";

const SECRET_KEY = ENV.JWT_SECRET_KEY; // Use environment variables for production

// Generate a JWT Token
export const generateToken = (
  payload: object
  //   expiresIn: string | number = "1h"
): string => {
  const { expiresIn } = payload as { expiresIn: string | number };
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

// Verify a JWT Token
export const verifyToken = (token: string): object | string => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

// Decode a JWT Token (without verification)
export const decodeToken = (
  token: string
): string | null | { [key: string]: any } => {
  return jwt.decode(token);
};
