import BaseRepo from './base.repo';
import { CommentModel, IComment } from '../models/comment.model';

class CommentRepo extends BaseRepo<IComment> {
	constructor() {
		super(CommentModel);
	}
}

export default CommentRepo;
