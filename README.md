# minterjs-util

[![NPM Package](https://img.shields.io/npm/v/minterjs-util.svg?style=flat-square)](https://www.npmjs.org/package/minterjs-util)
[![Build Status](https://travis-ci.org/MinterTeam/minterjs-util.svg?branch=master)](https://travis-ci.org/MinterTeam/minterjs-util)
[![Coverage Status](https://coveralls.io/repos/github/MinterTeam/minterjs-util/badge.svg?branch=master)](https://coveralls.io/github/MinterTeam/minterjs-util?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/MinterTeam/minterjs-util/blob/master/LICENSE)

A collection of utility functions for Minter

Please note that this package is under active development and is subject to change.

It is complemented by the following packages:
- [minter-js-sdk](https://github.com/MinterTeam/minter-js-sdk) complete JS solution to work with Minter
- [minter-js-org](https://github.com/MinterTeam/minter-js-org) communicate with minter.org user database
- [minterjs-wallet](https://github.com/MinterTeam/minterjs-wallet) to create wallet
- [minterjs-tx](https://github.com/MinterTeam/minterjs-tx) to create, manipulate and sign Minter transactions.

## Install

`npm install minterjs-util`

or from browser

```html
<script src="https://unpkg.com/minterjs-util"></script>
<script>
const pips = minterUtil.convertFromPip(1);
const fee = minterUtil.getFeeValue('0x01');
</script>
```

## License

MIT License
