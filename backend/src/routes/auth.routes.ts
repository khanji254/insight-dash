import { Router } from "express";
import { authRateLimiter } from "../middleware/rateLimiter";
import { authenticate } from "../middleware/authenticate";
import {
  registerHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
  meHandler,
  verifyOtpHandler,
  resendOtpHandler,
} from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/register", authRateLimiter, registerHandler);
authRouter.post("/verify-otp", authRateLimiter, verifyOtpHandler);
authRouter.post("/resend-otp", authRateLimiter, resendOtpHandler);
authRouter.post("/login", authRateLimiter, loginHandler);
authRouter.post("/refresh", authRateLimiter, refreshHandler);
authRouter.post("/logout", logoutHandler);
authRouter.get("/me", authenticate, meHandler);
