import { RequestHandler } from 'express';

import {
	handleValidationError,
	validateObjectId,
	validateSignupData
} from '../validators';
import { sendResponse } from '../utils/response';
import UserService from '../services/user.service';
import TicketService from '../services/ticket.service';
import { NotFoundError, UserError } from '../utils/errorHandler';
import { TicketStatus } from '../models/ticket.model';
import { IUser } from '../models/user.model';

class AdminController {
	static createAgent: RequestHandler = async (req, res) => {
		const { error, value: agentObject } = validateSignupData(req.body);
		if (error) return handleValidationError(error);

		const agent = await UserService.createUser(agentObject);

		return sendResponse({
			res,
			statusCode: 201,
			data: { agent },
			message: 'Agent created successfully.'
		});
	};

	static assignAgentToTicket: RequestHandler = async (req, res) => {
		const { ticketId, agentId } = req.params;
		const { error: ticketIdError } = validateObjectId({ _id: ticketId });
		const { error: agentIdError } = validateObjectId({ _id: agentId });

		if (ticketIdError) return handleValidationError(ticketIdError);
		if (agentIdError) return handleValidationError(agentIdError);

		let ticket = await TicketService.getTicketById(ticketId);
		if (!ticket) throw new NotFoundError('Ticket not found.');

		ticket = await TicketService.updateTicketById(ticketId, {
			status: TicketStatus.InProgress,
			assignee: agentId as IUser['_id']
		});

		return sendResponse({
			res,
			statusCode: 200,
			message: 'Ticket assigned successfully',
			data: { ticket }
		});
	};

	static closeTicket: RequestHandler = async (req, res) => {
		const { ticketId } = req.params;
		const { error } = validateObjectId({ _id: ticketId });
		if (error) return handleValidationError(error);

		let ticket = await TicketService.getTicketById(ticketId);
		if (!ticket) throw new NotFoundError('Ticket not found.');

		const adminId = req.user._id;

		if (ticket.status === TicketStatus.Closed)
			throw new UserError('Ticket is already closed.');

		ticket = await TicketService.updateTicketById(ticketId, {
			status: TicketStatus.Closed,
			closedAt: new Date(),
			closedBy: adminId
		});

		return sendResponse({
			res,
			data: { ticket },
			message: 'Ticket closed successfully.'
		});
	};
}

export default AdminController;
