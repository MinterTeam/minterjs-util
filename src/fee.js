import {padToEven, isHexString, getBinarySize} from 'ethjs-util';
import {TX_TYPE} from './tx-types.js';

/**
 *
 * @param txType
 * @param {string|Buffer} [payload]
 * @param {string} [coinSymbol]
 * @param {number} [multisendCount]
 * @return {boolean|number}
 */
export function getFeeValue(txType, {payload, coinSymbol, multisendCount} = {}) {
    // txType to string
    if (!isHexString(txType)) {
        txType = `0x${padToEven(txType.toString(16)).toUpperCase()}`;
    }

    if (txType === TX_TYPE.MULTISEND && !(multisendCount >= 1)) {
        throw new Error('`multisendCount` should be positive integer when tx type is TX_TYPE.MULTISEND');
    }

    let payloadLength;
    if (!payload) {
        payloadLength = 0;
    } else if (Buffer.isBuffer(payload)) {
        payloadLength = payload.length;
    } else {
        payloadLength = getBinarySize(payload.toString());
    }

    const baseUnits = BASE_FEES[txType];
    const COIN_UNIT = 0.001;
    const COIN_UNIT_PART = 1 / COIN_UNIT; // negate js math quirks, ex.: 18 * 0.001 = 0.018000000000000002
    // multisend fee = base fee + extra fee based on count
    const multisendExtraCountFee = txType === TX_TYPE.MULTISEND ? (multisendCount - 1) * MULTISEND_FEE_DELTA : 0;
    // coin symbol extra fee, value in base coin (not in units)
    const coinSymbolFee = txType === TX_TYPE.CREATE_COIN ? getCoinSymbolFee(coinSymbol) : 0;
    return (baseUnits + payloadLength * 2 + multisendExtraCountFee) / COIN_UNIT_PART + coinSymbolFee;
}

//
/**
 * @param {string} ticker
 * @return {number} - value in base coin (not in units)
 */
export function getCoinSymbolFee(ticker) {
    return COIN_SYMBOL_FEES[ticker && ticker.length] || 100;
}

// value in base coin (not in units)
// @See https://github.com/MinterTeam/minter-go-node/blob/master/core/transaction/create_coin.go#L93
export const COIN_SYMBOL_FEES = {
    3: 1000000,
    4: 100000,
    5: 10000,
    6: 1000,
};

export const MULTISEND_FEE_DELTA = 5;

/**
 * Tx fees in units
 * @type {{string: number}}
 */
export const BASE_FEES = {
    [TX_TYPE.SEND]: 10,
    [TX_TYPE.SELL]: 100,
    [TX_TYPE.SELL_ALL]: 100,
    [TX_TYPE.BUY]: 100,
    [TX_TYPE.CREATE_COIN]: 0,
    [TX_TYPE.DECLARE_CANDIDACY]: 10000,
    [TX_TYPE.DELEGATE]: 200,
    [TX_TYPE.UNBOND]: 200,
    [TX_TYPE.REDEEM_CHECK]: 30,
    [TX_TYPE.SET_CANDIDATE_ON]: 100,
    [TX_TYPE.SET_CANDIDATE_OFF]: 100,
    [TX_TYPE.CREATE_MULTISIG]: 100,
    [TX_TYPE.MULTISEND]: 10, // 10+(n-1)*5 units
    [TX_TYPE.EDIT_CANDIDATE]: 10000,
    [TX_TYPE.SET_HALT_BLOCK]: 1000,
    [TX_TYPE.RECREATE_COIN]: 10000000,
    [TX_TYPE.EDIT_COIN_OWNER]: 10000000,
    [TX_TYPE.EDIT_MULTISIG_OWNER]: 1000,
    [TX_TYPE.PRICE_VOTE]: 10,
    [TX_TYPE.EDIT_CANDIDATE_PUBLIC_KEY]: 100000000,
};
