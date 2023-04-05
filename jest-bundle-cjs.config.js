module.exports = {
    setupFilesAfterEnv: ["jest-expect-message"],
    moduleNameMapper: {
        '~\/src$': '<rootDir>/dist/cjs/index.js',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(pretty-num)/)',
    ],
    testEnvironment: 'node',
};
