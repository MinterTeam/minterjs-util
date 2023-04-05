module.exports = {
    setupFilesAfterEnv: ["jest-expect-message"],
    moduleNameMapper: {
        '~(.*)$': '<rootDir>/$1',
    },
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(minterjs-tx|minterjs-util|minterjs-wallet|pretty-num)/)',
    ],
    // collectCoverage: true,
    collectCoverageFrom: ["./src/**"],
    coverageReporters: ["lcov", "text"]
};
