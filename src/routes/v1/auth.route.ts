import { Router } from 'express';
import { Claims } from '../../models/role.model';
import isAuthenticated from '../../middleware/auth';
import hasClaim from '../../middleware/has-claim';
import AuthController from '../../controllers/auth.controller';
import catchAsyncErrors from '../../middleware/catch-async-errors';

const router = Router();

router.post('/users/login', catchAsyncErrors(AuthController.loginUser));
router.post('/users/register', catchAsyncErrors(AuthController.registerUser));

// This is not a public endpoint and can only be called by whoever has the "CanManageUsers" claim
router.post(
	'/users/create',
	[
		catchAsyncErrors(isAuthenticated),
		catchAsyncErrors(hasClaim(Claims.CanManageUsers))
	],
	catchAsyncErrors(AuthController.registerAgent)
);

export { router as authRoutes };
