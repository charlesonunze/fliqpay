import { Response } from 'express';

export interface ResponseParams {
	res: Response;
	message?: string;
	data?: anyObject;
	statusCode?: number;
}

export type anyObject = Record<string, unknown>;

export interface QueryParams {
	pageNo?: string;
	pageSize?: string;
}
