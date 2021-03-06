module.exports = {
	roots: ['<rootDir>'],
	testMatch: ['**/__tests__/**/*.+(ts|tsx|js)'],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest'
	},
	verbose: true
};
