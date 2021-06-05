import { paginateData } from '../../../src/utils';

describe('UTILITY FUNCTIONS', () => {
	afterEach((done) => {
		done();
	});

	describe('paginateData', () => {
		test('should return pagination query object', () => {
			const query = paginateData('1', '5');

			expect(query).toHaveProperty('skip');
			expect(query).toHaveProperty('limit');
		});
	});
});
