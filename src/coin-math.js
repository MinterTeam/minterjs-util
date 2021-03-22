import Big from 'big.js';

Big.RM = 2;

/**
 * Bancor sell COIN, calculate received BIP
 * @param {BancorCoinParams} coin
 * @param {number} coinAmount - sell COIN
 * @return {string} - get BIP
 */
export function sellCoin(coin, coinAmount) {
    if (!isCoinValid(coin)) {
        return '0';
    }
    coinAmount = Math.min(coin.supply, coinAmount);
    return new Big(coin.reserve).times(one().minus(one().minus(new Big(coinAmount).div(coin.supply)) ** one().div(coin.crr))).toFixed();
    // return coin.reserve * (1 - ((1 - coinAmount / coin.supply) ** (1 / coin.crr)));
}

/**
 * Bancor sell COIN, calculate needed COIN
 * @param {BancorCoinParams} coin
 * @param {number} bipAmount - get BIP
 * @return {string} - sell COIN
 */
export function sellCoinByBip(coin, bipAmount) {
    if (!isCoinValid(coin)) {
        return '0';
    }
    bipAmount = Math.min(coin.reserve, bipAmount);
    return new Big(coin.supply).times(one().minus(one().minus(new Big(bipAmount).div(coin.reserve)) ** coin.crr)).toFixed();
    // return coin.supply * (1 - ((1 - bipAmount / coin.reserve) ** coin.crr));
}

/**
 * Bancor buy COIN, calculate received COIN
 * @param {BancorCoinParams} coin
 * @param {number} bipAmount - pay BIP
 * @return {string} - get COIN
 */
export function buyCoin(coin, bipAmount) {
    if (!isCoinValid(coin)) {
        return '0';
    }
    return new Big(coin.supply).times(new Big(one().plus(new Big(bipAmount).div(coin.reserve)) ** coin.crr).minus(1)).toFixed();
    // return coin.supply * (((1 + bipAmount / coin.reserve) ** coin.crr) - 1);
}

/**
 * Bancor buy COIN, calculate needed BIP
 * @param {BancorCoinParams} coin
 * @param coinAmount - get COIN
 * @return {string} - pay BIP
 */
export function buyCoinByCoin(coin, coinAmount) {
    if (!isCoinValid(coin)) {
        return '0';
    }
    return new Big(coin.reserve).times(new Big(one().plus(new Big(coinAmount).div(coin.supply)) ** one().div(coin.crr)).minus(1)).toString();
    // return coin.reserve * (((1 + coinAmount / coin.supply) ** (1 / coin.crr)) - 1);
}

/**
 * @param {BancorCoinParams} coin
 * @return {boolean}
 */
function isCoinValid(coin) {
    return !!(coin.reserve && coin.supply && coin.crr);
}

function one() {
    return new Big(1);
}

/**
 * @typedef {Object} BancorCoinParams
 * @property {number|null} supply
 * @property {number|null} crr
 * @property {number|null} reserve - from 0 to 1
 */
