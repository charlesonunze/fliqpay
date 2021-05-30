import { Application } from 'express';
import { authRoutes } from '../routes/v1/auth.route';
import { swaggerRoute } from '../routes/docs.route';

export const loadRoutes = (app: Application) => {
	// Root Route
	app.get('/', (req, res) => {
		res.send('Hi there!');
	});

	// API Routes
	app.use('/api/v1', authRoutes);

	// Swagger Docs
	app.use('/api/docs', swaggerRoute);
};
