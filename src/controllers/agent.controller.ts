import { RequestHandler } from 'express';
import { resolve } from 'path';

import {
	handleValidationError,
	validateComment,
	validateObjectId
} from '../validators';
import TicketService from '../services/ticket.service';
import {
	ForbiddenError,
	NotFoundError,
	UserError,
	ValidationError
} from '../utils/errorHandler';
import { sendFile, sendResponse } from '../utils/response';
import { TicketStatus } from '../models/ticket.model';
import CommentsService from '../services/comments.service';
import {
	genRandNum,
	getReportHTML,
	paginateData,
	saveFile,
	toCSV,
	toPDF
} from '../utils';
import { QueryParams } from '../@types';
import { existsSync, mkdirSync } from 'fs';

class AgentController {
	static getOneTicket: RequestHandler = async (req, res) => {
		const { ticketId } = req.params;
		const { error } = validateObjectId({ _id: ticketId });
		if (error) return handleValidationError(error);

		const ticket = await TicketService.getTicketById(ticketId);

		if (!ticket) throw new NotFoundError('Ticket not found.');

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

		const tickets = await TicketService.getTickets({}, options);
		const count = await TicketService.getTicketsCount();

		return sendResponse({
			res,
			data: { tickets, count }
		});
	};

	static pickUpTicket: RequestHandler = async (req, res) => {
		const { ticketId } = req.params;
		const { error } = validateObjectId({ _id: ticketId });
		if (error) return handleValidationError(error);

		let ticket = await TicketService.getTicketById(ticketId);
		if (!ticket) throw new NotFoundError('Ticket not found.');

		switch (ticket.status) {
			case TicketStatus.IsActive:
				throw new ForbiddenError('Chill mate, another agent has got this.');

			case TicketStatus.InProgress:
				throw new ForbiddenError('Chill mate, another agent has got this.');

			case TicketStatus.Closed:
				throw new ForbiddenError('This ticket has been closed.');
		}

		const agentId = req.user._id;

		ticket = await TicketService.updateTicketById(ticketId, {
			status: TicketStatus.InProgress,
			assignee: agentId
		});

		return sendResponse({
			res,
			statusCode: 200,
			data: { ticket }
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

		const agentId = req.user._id;

		switch (ticket.status) {
			// The client application should save us this checks, but I have trust issues.
			case TicketStatus.Open:
				throw new ForbiddenError(
					'You cannot comment on a ticket that has not been picked up.'
				);

			case TicketStatus.Closed:
				throw new ForbiddenError('You cannot comment on a closed ticket.');

			case TicketStatus.InProgress:
				await TicketService.updateTicketById(ticketId, {
					status: TicketStatus.IsActive
				});

				break;
		}

		if (ticket.assignee.toString() !== agentId.toString())
			throw new ForbiddenError('Chill mate, another agent has got this.');

		commentObject.ticket = ticketId;
		commentObject.author = agentId;

		const comment = await CommentsService.createComment(commentObject);

		return sendResponse({
			res,
			statusCode: 201,
			data: { comment }
		});
	};

	static getCommentsInTicket: RequestHandler = async (req, res) => {
		const { ticketId } = req.params;
		const { error } = validateObjectId({ _id: ticketId });
		if (error) return handleValidationError(error);

		const ticket = await TicketService.getTicketById(ticketId);
		if (!ticket) throw new NotFoundError('Ticket not found.');

		const comments = await CommentsService.getCommentsByTicketId(ticketId);

		return sendResponse({
			res,
			data: { comments }
		});
	};

	static closeTicket: RequestHandler = async (req, res) => {
		const { ticketId } = req.params;
		const { error } = validateObjectId({ _id: ticketId });
		if (error) return handleValidationError(error);

		let ticket = await TicketService.getTicketById(ticketId);
		if (!ticket) throw new NotFoundError('Ticket not found.');

		const agentId = req.user._id;

		if (ticket.status === TicketStatus.Open)
			throw new UserError(
				'You cannot close a ticket with the status of "open".'
			);

		if (ticket.status === TicketStatus.Closed)
			throw new UserError('Ticket is already closed.');

		if (ticket.assignee && ticket.assignee.toString() !== agentId.toString())
			throw new ForbiddenError('Chill mate, another agent has got this.');

		ticket = await TicketService.updateTicketById(ticketId, {
			status: TicketStatus.Closed,
			closedAt: new Date(),
			closedBy: agentId
		});

		return sendResponse({
			res,
			data: { ticket },
			message: 'Ticket closed successfully.'
		});
	};

	static getTicketReport: RequestHandler = async (req, res) => {
		const { format } = req.query as QueryParams;

		const tickets = await TicketService.getReport();

		const folder = resolve(
			'./src',
			process.env.NODE_ENV === 'test' ? 'reports-test' : 'reports'
		);

		if (!existsSync(folder)) {
			mkdirSync(folder);
		}

		const fileName = `MONTHLY-REPORT-${genRandNum(10000, 90000)}`;
		let filePath: string;
		let csv: string;
		let html: string;

		switch (format) {
			case 'json':
				break;

			case 'csv':
				filePath = resolve(folder, fileName + '.csv');
				csv = await toCSV(tickets);
				return saveFile(filePath, csv)
					.then(() => sendFile({ res, filePath, mimeType: 'csv' }))
					.catch((err) => {
						throw new Error(err);
					});

			case 'pdf':
				filePath = resolve(folder, fileName + '.pdf');
				html = getReportHTML(tickets);
				return toPDF(html, filePath)
					.then(() => sendFile({ res, filePath, mimeType: 'pdf' }))
					.catch((err) => {
						throw new Error(err);
					});

			default:
				throw new UserError(
					'Invalid format. Valid formats are json, csv and pdf.'
				);
		}

		if (tickets.length < 1) throw new NotFoundError('No closed tickets.');

		return sendResponse({
			res,
			data: { tickets },
			message: 'Monthly tickets report.'
		});
	};
}

export default AgentController;
