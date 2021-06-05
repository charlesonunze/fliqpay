import { Document, Schema, model } from 'mongoose';
import { IUser } from './user.model';

enum TicketStatus {
	Open = 'open',
	Closed = 'closed',
	IsActive = 'is_active',
	InProgress = 'in_progress'
}

interface ITicket extends Document {
	title: string;
	status: TicketStatus;
	description: string;
	createdAt: Date;
	createdBy: IUser;
	assignee: IUser;
	closedAt: Date;
	closedBy: IUser;
}

interface ITicketObject {
	_id?: ITicket['_id'];
	title?: ITicket['title'];
	status?: ITicket['status'];
	description?: ITicket['description'];
	createdAt?: ITicket['createdAt'];
	createdBy?: ITicket['createdBy'];
	assignee?: ITicket['assignee'];
	closedAt?: ITicket['closedAt'];
	closedBy?: ITicket['closedBy'];
}

const ticketSchema = new Schema(
	{
		title: {
			type: String,
			required: true
		},
		status: {
			type: String,
			enum: Object.values(TicketStatus),
			default: TicketStatus.Open
		},
		description: {
			type: String,
			required: true
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		assignee: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		closedAt: {
			type: Date
		},
		closedBy: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	},
	{ timestamps: true }
);

ticketSchema.index({ status: 1, closedAt: 1 });

const TicketModel = model<ITicket>('Ticket', ticketSchema);

export { TicketModel, ITicket, ITicketObject, TicketStatus };
