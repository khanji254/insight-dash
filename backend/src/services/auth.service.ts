import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../db/prisma";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  refreshTokenExpiresAt,
} from "../lib/jwt";
import { AppError } from "../middleware/errorHandler";
import { JwtPayload } from "../middleware/authenticate";
import { generateAndSendOtp } from "./otp.service";

const SALT_ROUNDS = 12;

export async function register(email: string, password: string, name: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError(409, "Email already in use");

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { 
      email, 
      passwordHash, 
      name,
      status: 'PENDING_EMAIL', // User starts in pending email verification
    },
    select: { id: true, email: true, name: true, role: true, status: true },
  });
  
  // Send OTP to user's email
  await generateAndSendOtp(email);
  
  return {
    user,
    message: 'Registration successful. Please check your email for verification code.',
  };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError(401, "Invalid email or password");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError(401, "Invalid email or password");

  // Check user status
  if (user.status === 'PENDING_EMAIL') {
    throw new AppError(403, "Please verify your email address before logging in");
  }
  
  if (user.status === 'PENDING_APPROVAL') {
    throw new AppError(403, "Your account is pending admin approval");
  }
  
  if (user.status === 'SUSPENDED') {
    throw new AppError(403, "Your account has been suspended. Please contact support");
  }
  
  // Only ACTIVE users can log in
  if (user.status !== 'ACTIVE') {
    throw new AppError(403, "Account is not active");
  }

  return issueTokenPair({ userId: user.id, email: user.email, role: user.role });
}

export async function refresh(rawToken: string) {
  let payload: JwtPayload;
  try {
    payload = verifyRefreshToken(rawToken);
  } catch {
    throw new AppError(401, "Invalid or expired refresh token");
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { token: rawToken },
    include: { user: true },
  });
  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError(401, "Refresh token not found or expired");
  }

  // Rotate: delete old token, issue new pair
  await prisma.refreshToken.delete({ where: { id: stored.id } });
  return issueTokenPair({ userId: payload.userId, email: payload.email, role: payload.role });
}

export async function logout(rawToken: string) {
  await prisma.refreshToken.deleteMany({ where: { token: rawToken } });
}

export async function issueTokenPair(payload: JwtPayload) {
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: payload.userId,
      expiresAt: refreshTokenExpiresAt(),
    },
  });

  return { accessToken, refreshToken };
}
