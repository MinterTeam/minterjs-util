import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import babel from '@rollup/plugin-babel';

export default {
    input: 'src/index.js',
    plugins: [
        babel({
            babelrc: false,
            configFile: false,
            "plugins": [
                "@babel/plugin-proposal-optional-chaining",
                "@babel/plugin-proposal-numeric-separator",
            ],
        }),
        commonjs({
            // namedExports: {
            //     'node_modules/ethereumjs-util/dist/index.js': [ 'stripHexPrefix', 'padToEven' ],
            // },
        }),
        json(),
        globals(),
        builtins(),
        resolve({
            browser: true,
            preferBuiltins: false,
        }),
        babel(),
    ],
    output: {
        file: 'dist/index.js',
        format: 'umd',
        name: 'minterUtil',
    },
};
