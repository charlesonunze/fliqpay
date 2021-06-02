/* eslint-disable @typescript-eslint/no-empty-function */
import jwt from 'jsonwebtoken';
import httpMocks from 'node-mocks-http';

import isAuthenticated from '../../../src/middleware/auth';
import { JWT_EXPIRY_TIME, JWT_PRIVATE_KEY } from '../../../src/config';

describe('MIDDLEWARE FUNCTIONS', () => {
	afterEach((done) => {
		done();
	});

	describe('authenticationMiddleware', () => {
		test('should authenticate a request', () => {
			const user = {
				email: 'customerX@tickets.io',
				username: 'customerX',
				password: 'customerX'
			};
			const token = jwt.sign(user, JWT_PRIVATE_KEY, {
				expiresIn: JWT_EXPIRY_TIME
			});

			const req = httpMocks.createRequest({
				headers: {
					authorization: `Bearer ${token}`
				}
			});
			const res = httpMocks.createResponse();
			const next = function () {};

			isAuthenticated(req, res, next);

			expect(res.statusCode).toEqual(200);
			expect(res.statusMessage).toEqual('OK');
		});

		test('should throw an error if a token is not provided', () => {
			const req = httpMocks.createRequest({
				headers: {
					authorization: ''
				}
			});
			const res = httpMocks.createResponse();
			const next = function () {};

			expect(() => isAuthenticated(req, res, next)).toThrow(
				'Access denied. You need to be logged in to perform this action.'
			);
		});

		test('should throw an error if an invalid token is provided', () => {
			const token = jwt.sign('', 'JWT_PRIVATE_KEY');
			const req = httpMocks.createRequest({
				headers: {
					authorization: `Bearer ${token}`
				}
			});
			const res = httpMocks.createResponse();
			const next = function () {};

			expect(() => isAuthenticated(req, res, next)).toThrow('Invalid token.');
		});
	});

	describe('hasClaimMiddleware', () => {});

	describe('catchAsyncErrorsMiddleware', () => {});
});
