import BaseRepo from './base.repo';
import { IUser, UserModel } from '../models/user.model';

class UserRepo extends BaseRepo<IUser> {
	constructor() {
		super(UserModel);
	}
}

export default UserRepo;
