import { Document, Schema, model } from 'mongoose';
import { Roles } from './role.model';

interface IUser extends Document {
	email?: string;
	role?: string;
	username: string;
	password?: string;
}

interface IUserObject {
	email?: IUser['email'];
	role?: IUser['role'];
	username?: IUser['username'];
	password?: IUser['password'];
}

const userSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		required: true,
		enum: Object.values(Roles),
		default: Roles.Customer
	}
});

userSchema.index({ username: 1, email: 1 });

const UserModel = model<IUser>('User', userSchema);

export { UserModel, IUser, IUserObject };
