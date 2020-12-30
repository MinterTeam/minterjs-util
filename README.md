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

### getFeeValue()
Params:
- txType: number or string, tx type
- options: object
- options.payload: string or Buffer, tx payload
- options.coinSymbol: string, coin symbol if tx is coin creation (can be replaced with `coinSymbolLength`)
- options.coinSymbolLength: number, coin symbol length if tx is coin creation (can be replaced with `coinSymbol`)
- options.multisendCount: number, count of recipients if tx is multisend
```
import { getFeeValue, TX_TYPE } from 'minterjs-util';

getFeeValue(1);
// 0.01

getFeeValue(TX_TYPE.SEND);
// 0.01

getFeeValue(TX_TYPE.SEND, {payload: 'asé'});
// 0.018

getFeeValue(TX_TYPE.CREATE_COIN, {coinSymbol: 'ABCDEFG'});
// 10000

getFeeValue(TX_TYPE.CREATE_COIN, {coinSymbolLength: 6});
// 100000

getFeeValue(TX_TYPE.MULTISEND, {multisendCount: 5});
// 0.035
```

## License

MIT License
