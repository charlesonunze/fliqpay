import request from 'supertest';
import { anyObject } from '../../../src/@types';

export const apiEndpoint = '/api/v1';
import app from '../../../src/app';
import { TicketStatus } from '../../../src/models/ticket.model';
import TicketRepo from '../../../src/repos/ticket.repo';
import { disconnectDB } from '../../../src/startup/db';

describe('CUSTOMERS ROUTES', () => {
	let agentToken: any;
	let adminToken: any;
	let customer1Token: any;
	let customer2Token: any;

	beforeAll(async () => {
		customer1Token = await makeLoginRequest({
			email: 'customer1@tickets.io',
			password: 'customer1'
		});

		customer2Token = await makeLoginRequest({
			email: 'customer2@tickets.io',
			password: 'customer2'
		});

		adminToken = await makeLoginRequest({
			email: 'admin1@tickets.io',
			password: 'admin1'
		});

		agentToken = await makeLoginRequest({
			email: 'agent1@tickets.io',
			password: 'agent1'
		});
	});

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

		return response.body.data.token || null;
	}

	async function makePostRequest(url: string, data: anyObject, token?: string) {
		let response: any;

		if (token) {
			response = await request(app)
				.post(apiEndpoint + url)
				.set('Authorization', `Bearer ${token}`)
				.send(data);

			return response;
		}

		response = await request(app)
			.post(apiEndpoint + url)
			.send(data);

		return response;
	}

	async function makeGetRequest(url: string, token: string) {
		const response = await request(app)
			.get(apiEndpoint + url)
			.set('Authorization', `Bearer ${token}`);

		return response;
	}

	let ticketId: any;
	const ticketRepo = new TicketRepo();

	describe('CREATE TICKET - POST /api/v1/customers/tickets', () => {
		const url = '/customers/tickets';
		const ticket = {
			title: 'My test ticket',
			description: 'My test ticket'
		};

		test('should create a ticket', async () => {
			const response = await makePostRequest(url, ticket, customer1Token);
			ticketId = response.body.data.ticket._id.toString();

			expect(response.status).toEqual(201);
			expect(response.body.success).toEqual(true);
			expect(response.body.data).toHaveProperty('ticket');
		});

		test('should throw an error if ticket title already exists', async () => {
			const response = await makePostRequest(url, ticket, customer1Token);

			expect(response.status).toEqual(409);
			expect(response.body.success).toEqual(false);
			expect(response.body.message).toEqual(
				'A ticket with this title already exists.'
			);
		});

		test('should deny access to admins and agents', async () => {
			const adminResponse = await makePostRequest(url, ticket, adminToken);
			const agentResponse = await makePostRequest(url, ticket, agentToken);

			expect(adminResponse.status).toEqual(403);
			expect(adminResponse.body.message).toEqual('Access denied.');
			expect(agentResponse.status).toEqual(403);
			expect(agentResponse.body.message).toEqual('Access denied.');
		});
	});

	describe('GET TICKET - GET /api/v1/customers/tickets/:ticketId', () => {
		test('should get a single ticket', async () => {
			const url = `/customers/tickets/${ticketId}`;
			const response = await makeGetRequest(url, customer1Token);

			expect(response.status).toEqual(200);
			expect(response.body.success).toEqual(true);
			expect(response.body.data).toHaveProperty('ticket');
		});

		test('should throw an error if ticket was not found or created by another customer', async () => {
			const url = `/customers/tickets/${ticketId}`;
			const response = await makeGetRequest(url, customer2Token);

			expect(response.status).toEqual(404);
			expect(response.body.success).toEqual(false);
			expect(response.body.message).toEqual('Ticket not found.');
		});
	});

	describe('ADD COMMENT TO TICKET - POST /api/v1/customers/tickets/:ticketId/comments', () => {
		test('should prevent customer from commenting until an agent has commented', async () => {
			const url = `/customers/tickets/${ticketId}/comments`;
			const comment = { body: 'new comment' };

			const response = await makePostRequest(url, comment, customer1Token);

			expect(response.status).toEqual(403);
			expect(response.body.success).toEqual(false);
			expect(response.body.message).toEqual(
				'You cannot comment on a ticket until an agent has responded.'
			);
		});

		test('should allow customer to comment after an agent has commented', async () => {
			const url = `/customers/tickets/${ticketId}/comments`;
			const comment = { body: 'new comment' };

			// faking that an agent has commented
			await ticketRepo.updateOne(
				{ _id: ticketId },
				{ status: TicketStatus.IsActive }
			);

			const response = await makePostRequest(url, comment, customer1Token);

			expect(response.status).toEqual(201);
			expect(response.body.success).toEqual(true);
			expect(response.body.data).toHaveProperty('comment');
		});
	});

	describe('GET COMMENTS IN TICKET - GET /api/v1/customers/tickets/:ticketId/comments', () => {
		test('should get comments on a ticket', async () => {
			const url = `/customers/tickets/${ticketId}/comments`;

			const response = await makeGetRequest(url, customer1Token);

			expect(response.status).toEqual(200);
			expect(response.body.success).toEqual(true);
			expect(response.body.data).toHaveProperty('comments');
		});
	});
});
