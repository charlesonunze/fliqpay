import { components } from './components';

const swaggerDocs = {
	openapi: '3.0.0',
	info: {
		version: '1.0.3',
		title: 'TICKETS-ON-FLIQ REST API',
		description: 'Official documentation for TICKETS-ON-FLIQ REST API.'
	},
	schemes: [],
	servers: [
		{
			url: '/api',
			description: 'Development Server'
		}
	],

	paths: {},

	components: components
};

export { swaggerDocs };
