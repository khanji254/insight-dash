import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JwtPayload } from "../middleware/authenticate";

/** Parses a duration string like "15m" or "7d" into a Date */
function parseDuration(duration: string): Date {
  const unit = duration.slice(-1);
  const value = parseInt(duration.slice(0, -1), 10);
  const now = Date.now();
  if (unit === "m") return new Date(now + value * 60 * 1000);
  if (unit === "d") return new Date(now + value * 24 * 60 * 60 * 1000);
  throw new Error(`Unsupported duration format: ${duration}`);
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
}

export function refreshTokenExpiresAt(): Date {
  return parseDuration(env.JWT_REFRESH_EXPIRES_IN);
}
