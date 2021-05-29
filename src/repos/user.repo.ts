import BaseRepo from './base.repo';
import { UserModel } from '../models/user.model';

class UserRepo extends BaseRepo {
	constructor() {
		super(UserModel);
	}
}

export default UserRepo;
