import { Router } from 'express';
import { Claims } from '../../models/role.model';
import isAuthenticated from '../../middleware/auth';
import hasClaim from '../../middleware/has-claim';
import catchAsyncErrors from '../../middleware/catch-async-errors';
import CustomerController from '../../controllers/customer.controllers';

const router = Router();

router.post(
	'/customers/tickets',
	[
		catchAsyncErrors(isAuthenticated),
		catchAsyncErrors(hasClaim(Claims.CanCreateTickets))
	],
	catchAsyncErrors(CustomerController.createTicket)
);

router.get(
	'/customers/tickets/:ticketId',
	[
		catchAsyncErrors(isAuthenticated),
		catchAsyncErrors(hasClaim(Claims.CanViewTickets))
	],
	catchAsyncErrors(CustomerController.getTicket)
);

router.post(
	'/customers/tickets/:ticketId/comments',
	[
		catchAsyncErrors(isAuthenticated),
		catchAsyncErrors(hasClaim(Claims.CanCommentOnTickets))
	],
	catchAsyncErrors(CustomerController.addCommentToTicket)
);

router.get(
	'/customers/tickets/:ticketId/comments',
	[
		catchAsyncErrors(isAuthenticated),
		catchAsyncErrors(hasClaim(Claims.CanCommentOnTickets))
	],
	catchAsyncErrors(CustomerController.getCommentsInTicket)
);

export { router as customerRoutes };
