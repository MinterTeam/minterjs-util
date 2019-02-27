module.exports = {
    moduleNameMapper: {
        '~\/src$': '<rootDir>/dist/cjs/index.js',
    },
    // transform: {
    //     '^.+\\.jsx?$': 'babel-jest',
    // },
    testEnvironment: 'node',
};
