import {
	handleValidationError,
	validateLoginData,
	validateSignupData
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
});
