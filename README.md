# minterjs-util

[![NPM Package](https://img.shields.io/npm/v/minterjs-util.svg?style=flat-square)](https://www.npmjs.org/package/minterjs-util)
[![Build Status](https://img.shields.io/github/workflow/status/MinterTeam/minterjs-util/Test?label=test&style=flat-square)](https://github.com/MinterTeam/minterjs-util/actions/workflows/test-with-coverage.yml)
[![Coverage Status](https://img.shields.io/coveralls/github/MinterTeam/minterjs-util/master.svg?style=flat-square)](https://coveralls.io/github/MinterTeam/minterjs-util?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square&label=license)](https://github.com/MinterTeam/minterjs-util/blob/master/LICENSE)

A collection of utility functions for Minter

Please note that this package is under active development and is subject to change.

It is complemented by the following packages:
- [minter-js-sdk](https://github.com/MinterTeam/minter-js-sdk) complete JS solution to work with Minter
- [minterjs-wallet](https://github.com/MinterTeam/minterjs-wallet) take care of BIP39 mnemonic phrase, private key and address

## Install

`npm install minterjs-util`

or from browser

```html
<script src="https://unpkg.com/minterjs-util"></script>
<script>
const pips = minterUtil.convertFromPip(1);
const fee = (new minterUtil.FeePrice({/* ... */})).getFeeValue('0x01');
</script>
```

### FeePrice.getFeeValue()
Params:
- txType: number or string, tx type
- options: object
- options.payload: string or Buffer, tx payload
- options.payloadLength: number, length of payload
- options.coinSymbol: string, coin symbol if tx is coin creation (can be replaced with `coinSymbolLength`)
- options.coinSymbolLength: number, coin symbol length if tx is coin creation (can be replaced with `coinSymbol`)
- options.multisendCount: number, count of recipients if tx is multisend

Full example: [github.com/MinterTeam/minterjs-util/blob/master/test/fee.test.js](https://github.com/MinterTeam/minterjs-util/blob/master/test/fee.test.js)
```
import { FeePrice, TX_TYPE } from 'minterjs-util';
const getFeeValue = (new FeePrice({/* ... */})).getFeeValue;

getFeeValue(TX_TYPE.SEND);
// 0.01

getFeeValue(TX_TYPE.SEND, {payload: 'asé'});
// 0.018

getFeeValue(TX_TYPE.CREATE_COIN, {coinSymbol: 'ABCDEFG'});
// 10000

getFeeValue(TX_TYPE.CREATE_COIN, {coinSymbolLength: 6});
// 100000

getFeeValue(TX_TYPE.MULTISEND, {deltaItemCount: 5});
// 0.035
```

## License

MIT License
