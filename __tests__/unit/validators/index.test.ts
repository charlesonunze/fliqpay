import {
	handleValidationError,
	validateComment,
	validateLoginData,
	validateObjectId,
	validateSignupData,
	validateTicket
} from '../../../src/validators';

describe('VALIDATOR FUNCTIONS', () => {
	afterEach((done) => {
		done();
	});

	describe('handleValidationError', () => {
		test('should handle validation errors', () => {
			const invalidData = {};

			const { error } = validateLoginData(invalidData);

			expect(() => handleValidationError(error!)).toThrow();
		});
	});

	describe('validateLoginData', () => {
		test('should validate login data', () => {
			const invalidData = {};
			const validData = {
				email: 'customerX@tickets.io',
				password: 'customerX'
			};

			const failed = validateLoginData(invalidData);
			const passed = validateLoginData(validData);

			expect(passed.error).toEqual(undefined);
			expect(failed.error!.message).toEqual(`"email" is required`);
		});
	});

	describe('validateSignupData', () => {
		test('should validate signup data', () => {
			const invalidData = {};
			const validData = {
				email: 'customerX@tickets.io',
				username: 'customerX',
				password: 'customerX'
			};

			const failed = validateSignupData(invalidData);
			const passed = validateSignupData(validData);

			expect(passed.error).toEqual(undefined);
			expect(failed.error!.message).toEqual(`"username" is required`);
		});
	});

	describe('validateTicket', () => {
		test('should validate a ticket', () => {
			const invalidData = {};
			const validData = {
				title: 'My first ticket',
				description: 'This is my first ticket'
			};

			const failed = validateTicket(invalidData);
			const passed = validateTicket(validData);

			expect(passed.error).toEqual(undefined);
			expect(failed.error!.message).toEqual(`"title" is required`);
		});
	});

	describe('validateObjectId', () => {
		test('should validate an ObjectId', () => {
			const invalidData = {
				_id: 'invalid object id'
			};
			const validData = {
				_id: '60b8cdbd73fc62e14cacaf68'
			};

			const failed = validateObjectId(invalidData);
			const passed = validateObjectId(validData);

			expect(passed.error).toEqual(undefined);
			expect(failed.error!.message).toEqual(
				`"_id" with value "invalid object id" fails to match the valid mongo id pattern`
			);
		});
	});

	describe('validateComment', () => {
		test('should validate a comment', () => {
			const invalidData = {};
			const validData = {
				body: 'My first comment'
			};

			const failed = validateComment(invalidData);
			const passed = validateComment(validData);

			expect(passed.error).toEqual(undefined);
			expect(failed.error!.message).toEqual(`"body" is required`);
		});
	});
});
