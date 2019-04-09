module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                modules: "cjs",
            }
        ]
    ],
    plugins: [
        {
            visitor: {
                // transform import to the root module, bc. it will be transformed to require, but /src is es2015 not compatible with require
                ImportDeclaration(path) {
                    if (path.node.source.value === 'minterjs-tx/src/tx-types') {
                        path.node.source.value = 'minterjs-tx';
                    }
                },
            }
        }
    ]
}
