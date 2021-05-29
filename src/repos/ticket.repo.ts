import BaseRepo from './base.repo';
import { TicketModel } from '../models/ticket.model';

class TicketRepo extends BaseRepo {
	constructor() {
		super(TicketModel);
	}
}

export default TicketRepo;
