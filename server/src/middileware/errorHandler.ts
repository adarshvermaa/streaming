import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { DrizzleError } from "drizzle-orm";

interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error structure
  const errorResponse = {
    code: err.code || "INTERNAL_SERVER_ERROR",
    message: err.message || "Something went wrong",
    details: err.details,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  };

  // Log the error with additional context
  console.error(`[${new Date().toISOString()}] Error occurred:
    Method: ${req.method}
    Path: ${req.path}
    IP: ${req.ip}
    Message: ${err.message}
    Stack: ${err.stack}\n`);

  // Handle specific error types
  if (err instanceof ZodError) {
    // Validation error
    return res.status(400).json({
      ...errorResponse,
      code: "VALIDATION_ERROR",
      message: "Invalid request data",
      details: err.errors,
    });
  }

  if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
    // Authentication errors
    return res.status(401).json({
      ...errorResponse,
      code: "AUTHENTICATION_ERROR",
      message: "Invalid or expired token",
    });
  }

  if (err instanceof DrizzleError) {
    // Database errors (using Drizzle ORM)
    const dbError = handleDatabaseError(err);
    return res.status(dbError.statusCode).json({
      ...errorResponse,
      ...dbError,
    });
  }

  if (err.statusCode) {
    // Custom HTTP errors
    return res.status(err.statusCode).json(errorResponse);
  }

  // Fallback to generic server error
  res.status(500).json(errorResponse);
};

// Handle specific database errors
const handleDatabaseError = (err: DrizzleError) => {
  const dbError = err as any;

  switch (dbError.code) {
    case "23505": // Unique violation
      return {
        statusCode: 409,
        code: "CONFLICT",
        message: "Resource already exists",
        details: dbError.detail,
      };
    case "23503": // Foreign key violation
      return {
        statusCode: 400,
        code: "INVALID_REFERENCE",
        message: "Invalid reference to related resource",
      };
    case "23502": // Not null violation
      return {
        statusCode: 400,
        code: "MISSING_REQUIRED_FIELD",
        message: "Required field is missing",
      };
    default:
      return {
        statusCode: 500,
        code: "DATABASE_ERROR",
        message: "Database operation failed",
      };
  }
};

// Handle 404 errors
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    code: "NOT_FOUND",
    message: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString(),
  });
};

// Handle uncaught exceptions and rejections
process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.error("Unhandled Rejection at:", promise, "Reason:", reason);
  process.exit(1);
});
