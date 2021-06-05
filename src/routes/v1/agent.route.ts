import { Router } from 'express';
import { Claims } from '../../models/role.model';
import isAuthenticated from '../../middleware/auth';
import hasClaim from '../../middleware/has-claim';
import AgentController from '../../controllers/agent.controller';
import catchAsyncErrors from '../../middleware/catch-async-errors';

const router = Router();

// GET ONE TICKET
router.get(
	'/agents/tickets/:ticketId',
	[
		catchAsyncErrors(isAuthenticated),
		catchAsyncErrors(hasClaim(Claims.CanViewTickets))
	],
	catchAsyncErrors(AgentController.getOneTicket)
);

// GET ALL TICKETS
router.get(
	'/agents/tickets',
	[
		catchAsyncErrors(isAuthenticated),
		catchAsyncErrors(hasClaim(Claims.CanViewTickets))
	],
	catchAsyncErrors(AgentController.getTickets)
);

// PICK UP A TICKET
router.put(
	'/agents/tickets/:ticketId',
	[
		catchAsyncErrors(isAuthenticated),
		catchAsyncErrors(hasClaim(Claims.CanViewTickets))
	],
	catchAsyncErrors(AgentController.pickUpTicket)
);

// ADD COMMENT TO TICKET
router.post(
	'/agents/tickets/:ticketId/comments',
	[
		catchAsyncErrors(isAuthenticated),
		catchAsyncErrors(hasClaim(Claims.CanViewTickets))
	],
	catchAsyncErrors(AgentController.addCommentToTicket)
);

// GET COMMENTS IN TICKET
router.get(
	'/agents/tickets/:ticketId/comments',
	[
		catchAsyncErrors(isAuthenticated),
		catchAsyncErrors(hasClaim(Claims.CanViewTickets))
	],
	catchAsyncErrors(AgentController.getCommentsInTicket)
);

// CLOSE A TICKET
router.post(
	'/agents/tickets/:ticketId/close',
	[
		catchAsyncErrors(isAuthenticated),
		catchAsyncErrors(hasClaim(Claims.CanViewTickets))
	],
	catchAsyncErrors(AgentController.closeTicket)
);

// GET MONTHLY REPORT
router.get(
	'/tickets/report',
	[
		catchAsyncErrors(isAuthenticated),
		catchAsyncErrors(hasClaim(Claims.CanManageTickets))
	],
	catchAsyncErrors(AgentController.getTicketReport)
);

export { router as agentRoutes };
