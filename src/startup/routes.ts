import { Application } from 'express';
import { swaggerRoute } from '../routes/docs.route';

export const loadRoutes = (app: Application) => {
	// Root Route
	app.get('/', (req, res) => {
		res.send('Hi there!');
	});

	// API Routes

	// Swagger Docs
	app.use('/api/docs', swaggerRoute);
};
