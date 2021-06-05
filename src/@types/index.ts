import { Response } from 'express';

export interface ResponseParams {
	res: Response;
	message?: string;
	data?: anyObject;
	statusCode?: number;
	filePath?: string;
	mimeType?: string;
}

export type anyObject = Record<string, unknown>;

export interface QueryParams {
	pageNo?: string;
	pageSize?: string;
	format?: string;
}
