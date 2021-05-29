import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import express, { Application } from 'express';
import { registerRequestLogger } from '../utils/http.logger';

const corsOptions = {
	credentials: true,
	origin: true,
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

export const loadMiddleware = (app: Application) => {
	registerRequestLogger(app);
	app.use(cors(corsOptions));
	app.use(compression());
	app.use(helmet());

	app.use(
		express.urlencoded({
			limit: '5mb',
			extended: true
		})
	);
	app.use(express.json());
};
