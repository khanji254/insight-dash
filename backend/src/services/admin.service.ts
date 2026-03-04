import { prisma } from '../db/prisma';
import { sendAccountApprovedEmail } from '../lib/email';

/**
 * Get all users pending approval
 */
export const getPendingUsers = async () => {
  const users = await prisma.user.findMany({
    where: {
      status: 'PENDING_APPROVAL',
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  
  return users;
};

/**
 * Get all users with their current status
 */
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  return users;
};

/**
 * Approve a user account
 */
export const approveUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  if (user.status === 'ACTIVE') {
    throw new Error('User is already active');
  }
  
  if (user.status !== 'PENDING_APPROVAL') {
    throw new Error('User is not pending approval');
  }
  
  // Update user status to ACTIVE
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: 'ACTIVE' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
    },
  });
  
  // Send approval email
  try {
    await sendAccountApprovedEmail(updatedUser.email, updatedUser.name);
  } catch (error) {
    console.error('Failed to send approval email:', error);
    // Don't fail the approval if email fails
  }
  
  return updatedUser;
};

/**
 * Suspend a user account
 */
export const suspendUser = async (userId: number, reason?: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  if (user.status === 'SUSPENDED') {
    throw new Error('User is already suspended');
  }
  
  // Don't allow suspending admin users
  if (user.role === 'ADMIN') {
    throw new Error('Cannot suspend admin users');
  }
  
  // Update user status to SUSPENDED
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: 'SUSPENDED' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
    },
  });
  
  // Delete all refresh tokens for this user
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
  
  if (reason) {
    console.log(`User ${userId} suspended. Reason: ${reason}`);
  }
  
  return updatedUser;
};

/**
 * Reactivate a suspended user
 */
export const reactivateUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  if (user.status !== 'SUSPENDED') {
    throw new Error('User is not suspended');
  }
  
  // Update user status to ACTIVE
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: 'ACTIVE' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
    },
  });
  
  return updatedUser;
};

/**
 * Update user role (admin only)
 */
export const updateUserRole = async (
  userId: number,
  newRole: 'ADMIN' | 'ANALYST' | 'VIEWER'
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Update user role
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
    },
  });
  
  return updatedUser;
};

/**
 * Delete a user and all related data
 */
export const deleteUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Don't allow deleting admin users
  if (user.role === 'ADMIN') {
    throw new Error('Cannot delete admin users');
  }
  
  // Delete user and all related data (cascade handled by Prisma)
  await prisma.user.delete({
    where: { id: userId },
  });
  
  return { message: 'User deleted successfully' };
};
