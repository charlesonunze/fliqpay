import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import {
	handleValidationError,
	validateLoginData,
	validateSignupData
} from '../validators';
import UserService from '../services/user.service';
import { UserError } from '../utils/errorHandler';
import { sendResponse } from '../utils/response';
import { Roles } from '../models/role.model';
import { JWT_EXPIRY_TIME, JWT_PRIVATE_KEY } from '../config';

class AuthController {
	static registerUser: RequestHandler = async (req, res) => {
		const { error, value: userObject } = validateSignupData(req.body);
		if (error) return handleValidationError(error);

		const user = await UserService.createUser(userObject);
		const token = jwt.sign({ ...user }, JWT_PRIVATE_KEY, {
			expiresIn: JWT_EXPIRY_TIME
		});

		return sendResponse({
			res,
			statusCode: 201,
			data: { token },
			message: 'Registration successful.'
		});
	};

	static registerAgent: RequestHandler = async (req, res, next) => {
		req.body.role = Roles.Agent;
		await AuthController.registerUser(req, res, next);
	};

	static loginUser: RequestHandler = async (req, res) => {
		const { error, value: userObject } = validateLoginData(req.body);
		if (error) return handleValidationError(error);

		const user = await UserService.getUser(userObject);
		if (!user) throw new UserError('Invalid email or password.');

		const token = jwt.sign(user, JWT_PRIVATE_KEY, {
			expiresIn: JWT_EXPIRY_TIME
		});

		return sendResponse({
			res,
			data: { token },
			message: 'Login successful.'
		});
	};
}

export default AuthController;
