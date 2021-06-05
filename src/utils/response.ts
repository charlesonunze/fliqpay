import { ResponseParams } from '../@types';

export const sendResponse = ({
	res,
	data,
	message,
	statusCode = 200
}: ResponseParams) => {
	res.status(statusCode).json({
		success: statusCode < 400,
		message,
		data
	});
};

export const sendFile = ({
	res,
	filePath,
	mimeType,
	statusCode = 200
}: ResponseParams) => {
	switch (mimeType) {
		case 'csv':
			res.header('Content-Type', 'text/csv');
			break;

		case 'pdf':
			res.header('Content-Type', 'application/pdf');
			break;

		default:
			break;
	}

	res.status(statusCode).sendFile(filePath!);
};
