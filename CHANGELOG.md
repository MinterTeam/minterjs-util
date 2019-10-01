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
