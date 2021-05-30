import { NextFunction, Request, Response } from 'express';
import { Claims, Roles } from '../models/role.model';
import RolesService from '../services/roles.service';
import { ForbiddenError } from '../utils/errorHandler';

export default function (claim: Claims) {
	return async function (req: Request, res: Response, next: NextFunction) {
		const role = await RolesService.getRole(req.user.role as Roles);
		if (role?.claims.includes(claim)) {
			next();
		} else {
			throw new ForbiddenError('Access denied.');
		}
	};
}
