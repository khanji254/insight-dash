import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { ZodError } from "zod";

/** Typed application error with an HTTP status code */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/** Centralised error handler — must be the LAST app.use() before the server listens */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(422).json({
      status: "error",
      code: 422,
      message: "Validation failed",
      errors: err.flatten().fieldErrors,
    });
  }

  // Known operational errors (AppError)
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      status: "error",
      code: err.statusCode,
      message: err.message,
    });
  }

  // Unknown / programmer errors — hide details in production
  console.error("💥 Unexpected error:", err);
  return res.status(500).json({
    status: "error",
    code: 500,
    message:
      env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : err.message,
    ...(env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}
