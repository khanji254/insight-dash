import bcrypt from 'bcryptjs';
import { prisma } from '../db/prisma';
import { sendOtpEmail } from '../lib/email';

/**
 * Generate a 6-digit OTP code
 */
const generateOtpCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate and send OTP to user's email
 */
export const generateAndSendOtp = async (email: string) => {
  // Generate 6-digit code
  const otpCode = generateOtpCode();
  
  // Hash the code before storing
  const codeHash = await bcrypt.hash(otpCode, 10);
  
  // Set expiration to 15 minutes from now
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  
  // Delete any existing unused OTPs for this email
  await prisma.otpCode.deleteMany({
    where: {
      email,
      usedAt: null,
    },
  });
  
  // Store the hashed OTP
  await prisma.otpCode.create({
    data: {
      email,
      codeHash,
      expiresAt,
    },
  });
  
  // Send email with the plain OTP code
  await sendOtpEmail(email, otpCode);
  
  return { message: 'OTP sent to email' };
};

/**
 * Verify OTP code
 */
export const verifyOtp = async (email: string, code: string) => {
  // Find the most recent unused OTP for this email
  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      email,
      usedAt: null,
      expiresAt: {
        gt: new Date(), // Not expired
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  if (!otpRecord) {
    throw new Error('Invalid or expired OTP code');
  }
  
  // Verify the code
  const isValid = await bcrypt.compare(code, otpRecord.codeHash);
  
  if (!isValid) {
    throw new Error('Invalid OTP code');
  }
  
  // Mark OTP as used
  await prisma.otpCode.update({
    where: { id: otpRecord.id },
    data: { usedAt: new Date() },
  });
  
  // Update user status from PENDING_EMAIL to PENDING_APPROVAL
  const user = await prisma.user.update({
    where: { email },
    data: { status: 'PENDING_APPROVAL' },
  });
  
  return {
    message: 'Email verified successfully. Your account is pending admin approval.',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
    },
  };
};

/**
 * Resend OTP to user's email
 */
export const resendOtp = async (email: string) => {
  // Check if user exists and is in PENDING_EMAIL status
  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  if (user.status !== 'PENDING_EMAIL') {
    throw new Error('Email already verified or account in different status');
  }
  
  // Generate and send new OTP
  return generateAndSendOtp(email);
};

/**
 * Clean up expired OTP codes (can be run as a cron job)
 */
export const cleanupExpiredOtps = async () => {
  const result = await prisma.otpCode.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  
  return { deletedCount: result.count };
};
