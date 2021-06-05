import jwt from 'jsonwebtoken';
import request from 'supertest';

export const apiEndpoint = '/api/v1';
import app from '../../../src/app';
import { JWT_PRIVATE_KEY } from '../../../src/config';
import { disconnectDB } from '../../../src/startup/db';

describe('AUTHENTICATION ROUTES', () => {
	afterAll(() => {
		app.close();
		disconnectDB();
	});

	async function makeLoginRequest(loginDetails: {
		email: string;
		password: string;
	}) {
		const response = await request(app)
			.post(apiEndpoint + '/users/login')
			.send(loginDetails);

		return response;
	}

	async function makeSignupRequest(
		registrationDetails: {
			email: string;
			username: string;
			password: string;
		},
		token?: string
	) {
		let response: any;

		if (token) {
			response = await request(app)
				.post(apiEndpoint + '/users/create')
				.set('Authorization', `Bearer ${token}`)
				.send(registrationDetails);

			return response;
		}

		response = await request(app)
			.post(apiEndpoint + '/users/register')
			.send(registrationDetails);

		return response;
	}

	describe('USER LOGIN - POST /api/v1/users/login', () => {
		const loginDetails = {
			email: 'customer1@tickets.io',
			password: 'customer1'
		};

		test('should return a valid jwt', async () => {
			const response = await makeLoginRequest(loginDetails);

			const { token } = response.body.data;
			const payload = jwt.verify(token, JWT_PRIVATE_KEY);

			expect(response.status).toEqual(200);
			expect(response.body.success).toEqual(true);
			expect(response.body.data).toHaveProperty('token');
			expect(payload).toHaveProperty('role');
			expect(payload).toHaveProperty('email');
			expect(payload).toHaveProperty('username');
		});

		test('should throw an error if login data is incorrect', async () => {
			loginDetails.password = 'incorrect_password';

			const response = await makeLoginRequest(loginDetails);

			expect(response.status).toEqual(400);
			expect(response.body.data).toBeUndefined;
			expect(response.body.success).toEqual(false);
			expect(response.body.message).toEqual('Invalid email or password.');
		});

		test('should throw an error if login data is not valid', async () => {
			delete loginDetails.password;

			const response = await makeLoginRequest(loginDetails);

			expect(response.status).toEqual(422);
			expect(response.body.success).toEqual(false);
			expect(response.body.data).toBeUndefined;
			expect(response.body.message).toEqual('"password" is required');
		});
	});

	describe('CUSTOMER REGISTRATION - POST /api/v1/users/register', () => {
		const registrationDetails = {
			email: 'customerX@tickets.io',
			username: 'customerX',
			password: 'customerX'
		};

		test('should register a user and return a valid jwt', async () => {
			const response = await makeSignupRequest(registrationDetails);

			const { token } = response.body.data;
			const payload = jwt.verify(token, JWT_PRIVATE_KEY) as any;

			expect(response.status).toEqual(201);
			expect(response.body.success).toEqual(true);
			expect(response.body.data).toHaveProperty('token');
			expect(payload._doc).toHaveProperty('username');
			expect(payload._doc).toHaveProperty('email');
			expect(payload._doc).toHaveProperty('role');
			expect(response.body.message).toEqual('Registration successful.');
		});

		test('should throw an error if user already exists', async () => {
			const response = await makeSignupRequest(registrationDetails);

			expect(response.status).toEqual(409);
			expect(response.body.data).toBeUndefined;
			expect(response.body.success).toEqual(false);
			expect(response.body.message).toEqual(
				'A user with this email already exists.'
			);
		});

		test('should throw an error if input data is invalid', async () => {
			delete registrationDetails.email;

			const response = await makeSignupRequest(registrationDetails);

			expect(response.status).toEqual(422);
			expect(response.body.data).toBeUndefined;
			expect(response.body.success).toEqual(false);
			expect(response.body.message).toEqual('"email" is required');
		});
	});

	describe('AGENT REGISTRATION - POST /api/v1/users/create', () => {
		const registrationDetails = {
			email: 'agentX@tickets.io',
			username: 'agentX',
			password: 'agentX'
		};

		test('should register an agent and return a valid jwt', async () => {
			const loginResponse = await makeLoginRequest({
				email: 'admin1@tickets.io',
				password: 'admin1'
			});

			const { token: adminToken } = loginResponse.body.data;

			const response = await makeSignupRequest(registrationDetails, adminToken);

			const { token } = response.body.data;
			const payload = jwt.verify(token, JWT_PRIVATE_KEY) as any;

			expect(response.status).toEqual(201);
			expect(response.body.success).toEqual(true);
			expect(response.body.data).toHaveProperty('token');
			expect(payload._doc).toHaveProperty('role');
			expect(payload._doc).toHaveProperty('email');
			expect(payload._doc).toHaveProperty('username');
			expect(response.body.message).toEqual('Registration successful.');
		});

		test('should throw an error if token is invalid', async () => {
			const response = await makeSignupRequest(registrationDetails, 'BEYONCE');

			expect(response.status).toEqual(400);
			expect(response.body.success).toEqual(false);
			expect(response.body.message).toEqual('Invalid token.');
		});
	});
});
