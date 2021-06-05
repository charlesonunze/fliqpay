import { Router } from 'express';
import { Claims } from '../../models/role.model';
import isAuthenticated from '../../middleware/auth';
import hasClaim from '../../middleware/has-claim';
import AdminController from '../../controllers/admin.controller';
import catchAsyncErrors from '../../middleware/catch-async-errors';

const router = Router();

// CREATE AGENT
router.post(
	'/admin/agents',
	[
		catchAsyncErrors(isAuthenticated),
		catchAsyncErrors(hasClaim(Claims.CanManageUsers))
	],
	catchAsyncErrors(AdminController.createAgent)
);

// ASSIGN AGENT TO TICKET
router.post(
	'/admin/tickets/:ticketId/agents/:agentId',
	[
		catchAsyncErrors(isAuthenticated),
		catchAsyncErrors(hasClaim(Claims.CanManageUsers))
	],
	catchAsyncErrors(AdminController.assignAgentToTicket)
);

// CLOSE A TICKET
router.put(
	'/admin/tickets/:ticketId',
	[
		catchAsyncErrors(isAuthenticated),
		catchAsyncErrors(hasClaim(Claims.CanManageUsers))
	],
	catchAsyncErrors(AdminController.closeTicket)
);

export { router as adminRoutes };
