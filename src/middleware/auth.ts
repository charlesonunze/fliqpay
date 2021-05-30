import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IUserObject } from '../models/user.model';
import { JWT_PRIVATE_KEY } from '../config';
import { UnauthorizedError, UserError } from '../utils/errorHandler';

export default function (req: Request, _: Response, next: NextFunction) {
	const token = req.headers.authorization?.split(' ')[1];
	console.log('TOKEN >>>>>>>', token);
	if (!token) {
		throw new UnauthorizedError(
			'Access denied. You need to be logged in to perform this action.'
		);
	}

	try {
		const decoded = jwt.verify(token, JWT_PRIVATE_KEY) as IUserObject;
		req.user = decoded;
		next();
	} catch (error) {
		throw new UserError('Invalid token.');
	}
}
