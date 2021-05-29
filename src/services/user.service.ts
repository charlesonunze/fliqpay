import bcrypt from 'bcrypt';
import { IUserObject } from '../models/user.model';
import UserRepo from '../repos/user.repo';
import { DuplicateResourceError } from '../utils/errorHandler';

const userRepo = new UserRepo();

class UserService {
	static async createUser(userObject: IUserObject) {
		const { email, password } = userObject;
		let user = await UserService.getUser({ email });
		if (user)
			throw new DuplicateResourceError(
				'A user with this email already exists.'
			);

		const salt = await bcrypt.genSalt(10);
		userObject.password = await bcrypt.hash(password!, salt);

		user = (await userRepo.save({ ...userObject })) as IUserObject;
		user.password = undefined;
		return user;
	}

	static async getUser(userObject: IUserObject) {
		const { email, password } = userObject;
		if (!email) return null;

		const user = (await userRepo.findOne({ email })) as IUserObject;
		if (!user) return null;

		if (password) {
			const passwordIsValid = await bcrypt.compare(password, user.password!);
			if (!passwordIsValid) return null;

			user.password = undefined;
			return user;
		}

		user.password = undefined;
		return user;
	}
}

export default UserService;
