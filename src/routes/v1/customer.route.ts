import { Router } from 'express';
import { Claims } from '../../models/role.model';
import isAuthenticated from '../../middleware/auth';
import hasClaim from '../../middleware/has-claim';
import catchAsyncErrors from '../../middleware/catch-async-errors';
import CustomerController from '../../controllers/customer.controllers';

const router = Router();

// CREATE TICKET
router.post(
	'/customers/tickets',
	[
		catchAsyncErrors(isAuthenticated),
		catchAsyncErrors(hasClaim(Claims.CanCreateTickets))
	],
	catchAsyncErrors(CustomerController.createTicket)
);

// GET TICKETs
router.get(
	'/customers/tickets',
	[
		catchAsyncErrors(isAuthenticated),
		catchAsyncErrors(hasClaim(Claims.CanCreateTickets))
	],
	catchAsyncErrors(CustomerController.getTickets)
);

// GET TICKET BY ID
router.get(
	'/customers/tickets/:ticketId',
	[
		catchAsyncErrors(isAuthenticated),
		catchAsyncErrors(hasClaim(Claims.CanViewTickets))
	],
	catchAsyncErrors(CustomerController.getTicket)
);

// POST COMMENTS
router.post(
	'/customers/tickets/:ticketId/comments',
	[
		catchAsyncErrors(isAuthenticated),
		catchAsyncErrors(hasClaim(Claims.CanCommentOnTickets))
	],
	catchAsyncErrors(CustomerController.addCommentToTicket)
);

// GET COMMENTS
router.get(
	'/customers/tickets/:ticketId/comments',
	[
		catchAsyncErrors(isAuthenticated),
		catchAsyncErrors(hasClaim(Claims.CanCommentOnTickets))
	],
	catchAsyncErrors(CustomerController.getCommentsInTicket)
);

export { router as customerRoutes };
