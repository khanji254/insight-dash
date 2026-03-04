import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as adminService from '../services/admin.service';
import { AppError } from '../middleware/errorHandler';

// Validation schemas
const approveUserSchema = z.object({
  userId: z.number().int().positive(),
});

const suspendUserSchema = z.object({
  userId: z.number().int().positive(),
  reason: z.string().optional(),
});

const updateRoleSchema = z.object({
  userId: z.number().int().positive(),
  role: z.enum(['ADMIN', 'ANALYST', 'VIEWER']),
});

/**
 * GET /api/admin/users/pending
 * Get all users pending approval
 */
export const getPendingUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await adminService.getPendingUsers();
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users
 * Get all users
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await adminService.getAllUsers();
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/users/approve
 * Approve a user account
 */
export const approveUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = approveUserSchema.parse(req.body);
    const user = await adminService.approveUser(userId);
    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(400, 'Invalid request data', error.errors));
    }
    next(error);
  }
};

/**
 * PATCH /api/admin/users/suspend
 * Suspend a user account
 */
export const suspendUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, reason } = suspendUserSchema.parse(req.body);
    const user = await adminService.suspendUser(userId, reason);
    res.json({ message: 'User suspended successfully', user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(400, 'Invalid request data', error.errors));
    }
    next(error);
  }
};

/**
 * PATCH /api/admin/users/reactivate
 * Reactivate a suspended user
 */
export const reactivateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = approveUserSchema.parse(req.body);
    const user = await adminService.reactivateUser(userId);
    res.json({ message: 'User reactivated successfully', user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(400, 'Invalid request data', error.errors));
    }
    next(error);
  }
};

/**
 * PATCH /api/admin/users/role
 * Update user role
 */
export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, role } = updateRoleSchema.parse(req.body);
    const user = await adminService.updateUserRole(userId, role);
    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(400, 'Invalid request data', error.errors));
    }
    next(error);
  }
};

/**
 * DELETE /api/admin/users/:id
 * Delete a user
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.params.id as string, 10);
    if (isNaN(userId)) {
      throw new AppError(400, 'Invalid user ID');
    }
    
    const result = await adminService.deleteUser(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
