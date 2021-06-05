import { RequestHandler } from 'express';
import {
	handleValidationError,
	validateComment,
	validateTicket,
	validateObjectId
} from '../validators';
import TicketService from '../services/ticket.service';
import {
	ForbiddenError,
	NotFoundError,
	ValidationError
} from '../utils/errorHandler';
import { sendResponse } from '../utils/response';
import { TicketStatus } from '../models/ticket.model';
import CommentsService from '../services/comments.service';
import { QueryParams } from '../@types';
import { paginateData } from '../utils';

class CustomerController {
	static createTicket: RequestHandler = async (req, res) => {
		const { error, value: ticketObject } = validateTicket(req.body);
		if (error) return handleValidationError(error);

		const customerId = req.user._id;
		ticketObject.createdBy = customerId;

		const ticket = await TicketService.createTicket(ticketObject, customerId);

		return sendResponse({
			res,
			statusCode: 201,
			data: { ticket },
			message: 'Ticket created successfully.'
		});
	};

	static getTicket: RequestHandler = async (req, res) => {
		const { ticketId } = req.params;
		const { error } = validateObjectId({ _id: ticketId });
		if (error) return handleValidationError(error);

		const customerId = req.user._id;

		const ticket = await TicketService.getTicketById(ticketId);

		if (!ticket) throw new NotFoundError('Ticket not found.');
		if (customerId.toString() !== ticket.createdBy.toString())
			throw new NotFoundError('Ticket not found.');

		return sendResponse({
			res,
			data: { ticket }
		});
	};

	static getTickets: RequestHandler = async (req, res) => {
		const { pageNo, pageSize } = req.query as QueryParams;
		if (!pageNo || !pageSize)
			throw new ValidationError(
				'Please append the appropriate query strings to the request URL.'
			);

		const options = paginateData(pageNo!, pageSize!);

		const customerId = req.user._id;
		const tickets = await TicketService.getTickets(
			{ createdBy: customerId },
			options
		);
		const count = await TicketService.getTicketsCount();

		return sendResponse({
			res,
			data: { tickets, count }
		});
	};

	static addCommentToTicket: RequestHandler = async (req, res) => {
		const { ticketId } = req.params;
		const { error: ObjectIdError } = validateObjectId({ _id: ticketId });
		if (ObjectIdError) return handleValidationError(ObjectIdError);

		const { error, value: commentObject } = validateComment(req.body);
		if (error) return handleValidationError(error);

		const ticket = await TicketService.getTicketById(ticketId);
		if (!ticket) throw new NotFoundError('Ticket not found.');

		const customerId = req.user._id;

		if (ticket.createdBy.toString() !== customerId.toString())
			throw new ForbiddenError('You cannot comment on this ticket.');

		if (ticket.status !== TicketStatus.IsActive)
			throw new ForbiddenError(
				'You cannot comment on a ticket until an agent has responded.'
			);

		commentObject.ticket = ticketId;
		commentObject.author = customerId;

		const comment = await CommentsService.createComment(commentObject);

		return sendResponse({
			res,
			statusCode: 201,
			data: { comment }
		});
	};

	static getCommentsInTicket: RequestHandler = async (req, res) => {
		const { ticketId } = req.params;
		const { error: ObjectIdError } = validateObjectId({ _id: ticketId });
		if (ObjectIdError) return handleValidationError(ObjectIdError);

		const customerId = req.user._id;

		const ticket = await TicketService.getTicketById(ticketId);
		if (!ticket) throw new NotFoundError('Ticket not found.');
		if (customerId.toString() !== ticket.createdBy.toString())
			throw new NotFoundError('Ticket not found.');

		const comments = await CommentsService.getCommentsByTicketId(ticketId);

		return sendResponse({
			res,
			data: { comments }
		});
	};
}

export default CustomerController;
