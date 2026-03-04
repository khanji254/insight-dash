import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authenticate';
import * as adminController from '../controllers/admin.controller';

const router = Router();

// All admin routes require authentication and ADMIN role
router.use(authenticate);
router.use(authorize('ADMIN'));

// User management routes
router.get('/users', adminController.getAllUsers);
router.get('/users/pending', adminController.getPendingUsers);
router.patch('/users/approve', adminController.approveUser);
router.patch('/users/suspend', adminController.suspendUser);
router.patch('/users/reactivate', adminController.reactivateUser);
router.patch('/users/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

export default router;
