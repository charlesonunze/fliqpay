import { IComment } from '../models/comment.model';
import { ITicket } from '../models/ticket.model';
import CommentRepo from '../repos/comment.repo';

const commentRepo = new CommentRepo();

class CommentsService {
	static async createComment(commentObject: IComment) {
		return commentRepo.insertOne(commentObject);
	}

	static async getCommentsByTicketId(ticketId: ITicket['_id']) {
		return await commentRepo.find(
			{ ticket: ticketId },
			{ sort: { createdAt: 1 }, lean: true }
		);
	}
}

export default CommentsService;
