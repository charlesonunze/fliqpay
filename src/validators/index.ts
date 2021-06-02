import Joi, { ValidationError as InputError } from 'joi';
import { ValidationError } from '../utils/errorHandler';
import { anyObject } from '../@types';
import { Roles } from '../models/role.model';

export const handleValidationError = (error: InputError) => {
	const { details } = error;
	const errorMessage = details[0].message;
	throw new ValidationError(errorMessage);
};

export const validateLoginData = (data: anyObject) => {
	const schema = Joi.object({
		email: Joi.string().trim().email().min(3).max(320).required(),
		password: Joi.string().trim().min(6).max(25).required()
	});

	return schema.validate(data);
};

export const validateSignupData = (data: anyObject) => {
	const schema = Joi.object({
		username: Joi.string().trim().min(6).max(50).required(),
		email: Joi.string().trim().email().min(3).max(320).required(),
		password: Joi.string().trim().min(6).max(25).required(),
		role: Joi.string()
			.trim()
			.valid(...Object.values(Roles))
	});

	return schema.validate(data);
};
