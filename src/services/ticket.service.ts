import { QueryFindOptions } from 'mongoose';
import { DuplicateResourceError } from '../utils/errorHandler';
import { IUser } from '../models/user.model';
import TicketRepo from '../repos/ticket.repo';
import { ITicket, ITicketObject } from '../models/ticket.model';

const ticketRepo = new TicketRepo();

class TicketService {
	static async createTicket(ticketObject: ITicket, userId: IUser['_id']) {
		let ticket = await TicketService.getTicket({
			title: ticketObject.title,
			createdBy: userId
		});

		if (ticket)
			throw new DuplicateResourceError(
				'A ticket with this title already exists.'
			);

		ticket = await ticketRepo.insertOne(ticketObject);
		return ticket;
	}

	static async getTicket(query: ITicketObject) {
		return await ticketRepo.findOne(query);
	}

	static async getTicketById(_id: ITicket['_id']) {
		return await ticketRepo.findById(_id);
	}

	static async getTickets(query: ITicketObject, options: QueryFindOptions) {
		return await ticketRepo.find(query, {
			sort: { createdAt: 1 },
			lean: true,
			...options
		});
	}

	static async getTicketsCount() {
		return await ticketRepo.getEstimatedDocCount();
	}

	static async updateTicketById(
		ticketId: ITicket['_id'],
		propsToUpdate: ITicketObject
	) {
		return await ticketRepo.findOneAndUpdate(
			{ _id: ticketId },
			{ $set: propsToUpdate },
			{ new: true }
		);
	}

	static async getReport() {
		const today = new Date();
		const todayLastMonth = new Date(
			today.getFullYear(),
			today.getMonth() - 1,
			today.getDate() + 1
		);

		const pipeline: any[] = [
			{
				$match: {
					status: 'closed',
					$and: [
						{ closedAt: { $gte: todayLastMonth } },
						{ closedAt: { $lt: today } }
					]
				}
			},
			{ $sort: { closedAt: -1 } },
			{
				$project: {
					Title: '$title',
					Description: '$description',
					Status: '$status',
					'Date Closed': '$closedAt'
				}
			}
		];

		return await ticketRepo.aggregate(pipeline);
	}
}

export default TicketService;
