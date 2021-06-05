import { Types } from 'mongoose';
import request from 'supertest';
import { anyObject } from '../../../src/@types';

export const apiEndpoint = '/api/v1';
import app from '../../../src/app';
import { ITicket } from '../../../src/models/ticket.model';
import { IUser } from '../../../src/models/user.model';
import TicketRepo from '../../../src/repos/ticket.repo';
import { disconnectDB } from '../../../src/startup/db';

describe('AGENT ROUTES', () => {
	let agent1Token: any;
	let agent2Token: any;
	let ticketId: any;
	const ticketRepo = new TicketRepo();

	beforeAll(async () => {
		agent1Token = await makeLoginRequest({
			email: 'agent1@tickets.io',
			password: 'agent1'
		});

		agent2Token = await makeLoginRequest({
			email: 'agent2@tickets.io',
			password: 'agent2'
		});

		const id = Types.ObjectId();

		ticketId = (
			await ticketRepo.insertOne({
				title: 'title',
				description: 'desc',
				createdBy: id as IUser['_id']
			} as ITicket)
		)._id;
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

	async function makePutRequest(url: string, token?: string) {
		let response: any;

		if (token) {
			response = await request(app)
				.put(apiEndpoint + url)
				.set('Authorization', `Bearer ${token}`)
				.send();

			return response;
		}

		response = await request(app)
			.put(apiEndpoint + url)
			.send();

		return response;
	}

	describe('PICKUP A TICKET - PUT /api/v1/agents/tickets/:ticketId', () => {
		test('should pick up a ticket', async () => {
			const url = `/agents/tickets/${ticketId}`;
			const response = await makePutRequest(url, agent1Token);

			expect(response.status).toEqual(200);
			expect(response.body.success).toEqual(true);
			expect(response.body.data).toHaveProperty('ticket');
			expect(response.body.data.ticket.status).toEqual('in_progress');
		});

		test('should throw an error if ticket is already in progress', async () => {
			const url = `/agents/tickets/${ticketId}`;
			const response = await makePutRequest(url, agent2Token);

			expect(response.status).toEqual(403);
			expect(response.body.success).toEqual(false);
			expect(response.body.message).toEqual(
				'Chill mate, another agent has got this.'
			);
		});
	});

	describe('COMMENT ON A TICKET - POST /api/v1/agents/tickets/:ticketId/comments', () => {
		test('should comment on a ticket', async () => {
			const url = `/agents/tickets/${ticketId}/comments`;
			const comment = { body: 'new comment' };
			const response = await makePostRequest(url, comment, agent1Token);

			expect(response.status).toEqual(201);
			expect(response.body.success).toEqual(true);
			expect(response.body.data).toHaveProperty('comment');
		});

		test('should throw an error if another agent was assigned to the ticket', async () => {
			const url = `/agents/tickets/${ticketId}/comments`;
			const comment = { body: 'new comment' };
			const response = await makePostRequest(url, comment, agent2Token);

			expect(response.status).toEqual(403);
			expect(response.body.success).toEqual(false);
		});
	});

	describe('CLOSE A TICKET - POST /api/v1/agents/tickets/:ticketId/close', () => {
		test('should throw an error if another agent was assigned to the ticket', async () => {
			const url = `/agents/tickets/${ticketId}/comments`;
			const comment = { body: 'new comment' };
			const response = await makePostRequest(url, comment, agent2Token);

			expect(response.status).toEqual(403);
			expect(response.body.success).toEqual(false);
			expect(response.body.message).toEqual(
				'Chill mate, another agent has got this.'
			);
		});

		test('should close a ticket', async () => {
			const url = `/agents/tickets/${ticketId}/close`;
			const response = await makePostRequest(url, {}, agent1Token);

			expect(response.status).toEqual(200);
			expect(response.body.success).toEqual(true);
			expect(response.body.data).toHaveProperty('ticket');
			expect(response.body.data.ticket.status).toEqual('closed');
		});

		test('should throw an error if a ticket is already closed', async () => {
			const url = `/agents/tickets/${ticketId}/comments`;
			const comment = { body: 'new comment' };
			const response = await makePostRequest(url, comment, agent2Token);

			expect(response.status).toEqual(403);
			expect(response.body.success).toEqual(false);
			expect(response.body.message).toEqual(
				'You cannot comment on a closed ticket.'
			);
		});
	});
});
