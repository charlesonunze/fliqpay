import BaseRepo from './base.repo';
import { CommentModel } from '../models/comment.model';

class CommentRepo extends BaseRepo {
	constructor() {
		super(CommentModel);
	}
}

export default CommentRepo;
