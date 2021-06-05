import { Types } from 'mongoose';
import request from 'supertest';
import { anyObject } from '../../../src/@types';

export const apiEndpoint = '/api/v1';
import app from '../../../src/app';
import { Roles } from '../../../src/models/role.model';
import { ITicket } from '../../../src/models/ticket.model';
import { IUser } from '../../../src/models/user.model';
import TicketRepo from '../../../src/repos/ticket.repo';
import { disconnectDB } from '../../../src/startup/db';

describe('AGENT ROUTES', () => {
	let adminToken: any;
	let ticketId: any;
	let agentId: any;
	const ticketRepo = new TicketRepo();

	beforeAll(async () => {
		adminToken = await makeLoginRequest({
			email: 'admin1@tickets.io',
			password: 'admin1'
		});

		let id = Types.ObjectId();

		ticketId = (
			await ticketRepo.insertOne({
				title: 'title',
				description: 'desc',
				createdBy: id as IUser['_id']
			} as ITicket)
		)._id;

		id = Types.ObjectId();

		agentId = (
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

	describe('CREATE AN AGENT - POST /api/v1/admin/agents', () => {
		test('should create an agent', async () => {
			const url = `/admin/agents`;
			const agent = {
				username: 'agentXX',
				email: 'agentXX@tickets.io',
				role: Roles.Agent,
				password: 'agentXX'
			};

			const response = await makePostRequest(url, agent, adminToken);

			expect(response.status).toEqual(201);
			expect(response.body.success).toEqual(true);
			expect(response.body.data).toHaveProperty('agent');
		});
	});

	describe('ASSIGN AGENT TO TICKET - POST /api/v1/agents/tickets/:ticketId/comments', () => {
		test('should assign an agent to a ticket', async () => {
			const url = `/admin/tickets/${ticketId}/agents/${agentId}`;
			const response = await makePostRequest(url, {}, adminToken);

			expect(response.status).toEqual(200);
			expect(response.body.success).toEqual(true);
			expect(response.body.data).toHaveProperty('ticket');
		});
	});

	describe('CLOSE A TICKET - PUT /api/v1/agents/tickets/:ticketId/close', () => {
		test('should close a ticket', async () => {
			const url = `/admin/tickets/${ticketId}`;
			const response = await makePutRequest(url, adminToken);

			expect(response.status).toEqual(200);
			expect(response.body.success).toEqual(true);
			expect(response.body.data).toHaveProperty('ticket');
			expect(response.body.data.ticket.status).toEqual('closed');
		});
	});
});
