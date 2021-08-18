WIP
- add `add_limit_order`, `remove_limit_order` tx types

## 0.21.0 - 2021.04.09
- add v2.0 tx types
- add `payloadLength` param to `getFeeValue`
- **BREAKING** fee module now designed as constructor, which accepts current network fee values and returns instance with method `getFeeValue`
- **BREAKING** TX_TYPE.EDIT_COIN_OWNER renamed to TX_TYPE.EDIT_TICKER_OWNER
- **BREAKING** remove deprecated `numToBig` and default export from converter module, use `numberToBig` and named exports instead
- **BREAKING** converter and coin-math now rounds to half even to align with blockchain rounding

## 0.20.0 - 2020.12.30
- **BREAKING** change fee calculation for Create Coin tx (now it depends on unit value)
- add `coinSymbolLength` param to `getFeeValue`

## 0.19.0 - 2020.12.22
- **BREAKING** change unit value, which is used in fee calculation, from 0.001 to 0.1

## 0.18.1
- deprecate `numToBig`, use `numberToBig` instead

## 0.18.0
- add chilinet tx types and fees

## 0.17.0 - 2020-08-7
- update deps

## 0.16.2 - 2020-05-31
- export variables

## 0.16.1 - 2020-05-31
- move here tx-types and coin helpers from [minterjs-tx](https://github.com/MinterTeam/minterjs-tx)

## 0.15.2 - 2020-05-30
- export `numToBig` function

## 0.15.1 - 2020-01-29
- fix naming typo

## 0.15.0 - 2019-12-16
- add `addressToString` method
- add `checkToString` method
- allow `publicToString` to accept `0x` prefixed strings

## 0.14.1 - 2019-11-13
- update `toBuffer` error message on invalid string

## 0.14.0 - 2019-11-12
- **BREAKING** toBuffer accepts only Minter prefixed and `0x` prefixed string params now, you have to use `Buffer.from(str, 'utf-8')` if you want pass arbitrary string
- drop safe-buffer dependency

## 0.13.1 - 2019-10-24
- lighten converter.js by using part of previous deps

## 0.13.0 - 2019-10-01
- **BREAKING** throws on invalid `multisendCount` param
- fix multisend fee calculation

## 0.12.0 - 2019-08-15
- **BREAKING** coin math functions now return string instead of number

## 0.11.0 - 2019-08-14
- **BREAKING** update `getFeeValue`, `payloadLength` param changed to `payload` string and moved to options object, `coinSymbolLength` param changed to `coinSymbol` string
- **BREAKING** update `getCoinSymbolFee`, `coinSymbolLength` param changed to `coinSymbol` string

## 0.10.1 - 2019-07-30
- fix browser usage of UMD module
- tweak bundle tests

# 0.10.0 - 2019-07-10
- add coin math functions

# 0.9.1 - 2019-07-08
- update deps

# 0.9.0 - 2019-06-13
- Added: `isValidTransaction` methods

# 0.8.1 - 2019-06-05
- update deps

# 0.8.0 - 2019-05-14
- **BREAKING** Removed: moved `defineProperties` to [minterjs-tx](https://github.com/MinterTeam/minterjs-tx) package

# 0.7.3 - 2019-05-12
- Fixed: update CreateCoin fee to return minimal fee when `coinSymbolLength` is not specified

# 0.7.2 - 2019-05-12
- Fixed: update CreateCoin tx commission according to minter-node [v0.19.0](https://github.com/MinterTeam/minter-go-node/blob/master/CHANGELOG.md#0190)

# 0.7.1 - 2019-04-10
- Changed: `getFeeValue` returns `false` instead of throwing

# 0.7.0 - 2019-04-09
- Added: `getFeeValue` method

# 0.6.1 - 2019-02-28
- fix package.json "browser" field

# 0.6.0 - 2019-02-27
- add UMD and commonjs builds

# 0.5.0 - 2019-02-20
- **BREAKING** converting to hex now pad to even (`11` will become `0b` instead of `b`)

# 0.4.0 - 2019-02-19
- **BREAKING** converting from pip to bip in hex format will throw an error
- **BREAKING** converting invalid number will throw instead of returning `NaN`
- replace `bignumber.js` dependency with `big.js` to reduce size

# 0.3.3 - 2019-02-18
- update deps
- fix ethereumjs-util

# 0.3.2 - 2019-02-18
- broken version

# 0.3.1 - 2019-02-06
- add `nonBinaryArrayTransform` option to `defineProperties()`

# 0.3.0 - 2019-02-06
- add `defineProperties()` method
- update deps

# 0.2.3 - 2018-12-06
- add `privateToAddressString()` methods

## 0.2.2 - 2018-11-30
- fix converter to not produce exponential values

## 0.2.1 - 2018-11-29
- add option to convert to hex value

## 0.2.0 - 2018-11-26
- **BREAKING** update converter to return `string` instead of `BigNumber`

## 0.1.0 - 2018-11-24
- add pip converter utils: `convert`, `convertToPip`, `convertFromPip`. (Moved from `minterjs-tx` package)
