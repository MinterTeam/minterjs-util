module.exports = {
    setupFilesAfterEnv: ["jest-expect-message"],
    moduleNameMapper: {
        '~\/src$': '<rootDir>/dist/cjs/index.js',
    },
    testEnvironment: 'node',
};
