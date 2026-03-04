import rateLimit from "express-rate-limit";
import { env } from "../config/env";

/** Applied globally to all routes */
export const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    status: 429,
    error: "Too many requests. Please try again later.",
  },
});

/** Stricter limit for auth endpoints (login / refresh) */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    status: 429,
    error: "Too many authentication attempts. Please try again in 15 minutes.",
  },
});
