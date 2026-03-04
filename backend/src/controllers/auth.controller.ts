import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as authService from "../services/auth.service";
import * as otpService from "../services/otp.service";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

const verifyOtpSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "OTP code must be 6 digits"),
});

const resendOtpSchema = z.object({
  email: z.string().email(),
});

export async function registerHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name } = registerSchema.parse(req.body);
    const result = await authService.register(email, password, name);
    res.status(201).json({ status: "success", data: result });
  } catch (err) {
    next(err);
  }
}

export async function verifyOtpHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, code } = verifyOtpSchema.parse(req.body);
    const result = await otpService.verifyOtp(email, code);
    res.json({ status: "success", data: result });
  } catch (err) {
    next(err);
  }
}

export async function resendOtpHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = resendOtpSchema.parse(req.body);
    const result = await otpService.resendOtp(email);
    res.json({ status: "success", data: result });
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const tokens = await authService.login(email, password);
    res.json({ status: "success", data: tokens });
  } catch (err) {
    next(err);
  }
}

export async function refreshHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const tokens = await authService.refresh(refreshToken);
    res.json({ status: "success", data: tokens });
  } catch (err) {
    next(err);
  }
}

export async function logoutHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    await authService.logout(refreshToken);
    res.json({ status: "success", data: null });
  } catch (err) {
    next(err);
  }
}

export function meHandler(req: Request, res: Response) {
  res.json({ status: "success", data: { user: req.user } });
}
