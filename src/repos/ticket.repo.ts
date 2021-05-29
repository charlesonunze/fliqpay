import BaseRepo from './base.repo';
import { ITicket, TicketModel } from '../models/ticket.model';

class TicketRepo extends BaseRepo<ITicket> {
	constructor() {
		super(TicketModel);
	}
}

export default TicketRepo;
