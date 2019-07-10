/**
 * Sell COIN, calculate received BIP
 * @param {Coin} coin
 * @param {number} coinAmount - sell COIN
 * @return {number} - get BIP
 */
export function sellCoin(coin, coinAmount) {
    if (!isCoinValid(coin)) {
        return 0;
    }
    coinAmount = Math.min(coin.supply, coinAmount);
    return coin.reserve * (1 - ((1 - coinAmount / coin.supply) ** (1 / coin.crr)));
}

/**
 * Sell COIN, calculate needed COIN
 * @param {Coin} coin
 * @param {number} bipAmount - get BIP
 * @return {number} - sell COIN
 */
export function sellCoinByBip(coin, bipAmount) {
    if (!isCoinValid(coin)) {
        return 0;
    }
    bipAmount = Math.min(coin.reserve, bipAmount);
    return coin.supply * (1 - ((1 - bipAmount / coin.reserve) ** coin.crr));
}

/**
 * Buy COIN, calculate received COIN
 * @param {Coin} coin
 * @param {number} bipAmount - pay BIP
 * @return {number} - get COIN
 */
export function buyCoin(coin, bipAmount) {
    if (!isCoinValid(coin)) {
        return 0;
    }
    return coin.supply * (((1 + bipAmount / coin.reserve) ** coin.crr) - 1);
}

/**
 * Buy COIN, calculate needed BIP
 * @param {Coin} coin
 * @param coinAmount - get COIN
 * @return {number} - pay BIP
 */
export function buyCoinByCoin(coin, coinAmount) {
    if (!isCoinValid(coin)) {
        return 0;
    }
    return coin.reserve * (((1 + coinAmount / coin.supply) ** (1 / coin.crr)) - 1);
}

/**
 * @param {Coin} coin
 * @return {boolean}
 */
function isCoinValid(coin) {
    return !!(coin.reserve && coin.supply && coin.crr);
}


/**
 * @typedef {Object} Coin
 * @property {number|null} supply
 * @property {number|null} crr
 * @property {number|null} reserve
 */
