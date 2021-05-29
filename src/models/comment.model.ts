import { Document, Schema, model } from 'mongoose';
import { ITicket } from './ticket.model';
import { IUser } from './user.model';

interface IComment extends Document {
	body: string;
	createdAt?: Date;
	author: IUser['_id'];
	ticket: ITicket['_id'];
}

const commentSchema = new Schema(
	{
		body: { type: String, required: true },
		ticket: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
		author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
	},
	{ timestamps: true }
);

commentSchema.index({ ticket: 1, createdAt: 1 });

const CommentModel = model<IComment>('Comment', commentSchema);

export { CommentModel, IComment };
