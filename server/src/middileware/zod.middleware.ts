import { z, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { ERROR } from "../constant/errorHandler/errorManagement";

/**
 * Higher-order function for Zod validation.
 * @param schema - Zod schema for validation
 * @returns Express middleware
 */
export const zodValidator =
    (schema: ZodSchema) =>
        (req: Request, res: Response, next: NextFunction): void => {
            try {
                schema.parse(req.body); // Validate the request body
                next(); // If validation passes, proceed to the next middleware/handler
            } catch (error) {
                if (error instanceof z.ZodError) {
                    res.status(400).json({
                        success: false,
                        errors: error.errors.map((err) => ({
                            field: err.path.join("."),
                            message: err.message,
                        })),
                    });
                    return
                }
                res.status(500).send({
                    message: ERROR.SERVER_ERROR, status: false, code: 500, error: error
                });
                return
            }
        };
