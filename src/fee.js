import {
    TX_TYPE_SEND, TX_TYPE_SELL, TX_TYPE_SELL_ALL, TX_TYPE_BUY, TX_TYPE_CREATE_COIN, TX_TYPE_DECLARE_CANDIDACY, TX_TYPE_SET_CANDIDATE_ON, TX_TYPE_SET_CANDIDATE_OFF, TX_TYPE_DELEGATE, TX_TYPE_UNBOND, TX_TYPE_REDEEM_CHECK, TX_TYPE_CREATE_MULTISIG, TX_TYPE_MULTISEND, TX_TYPE_EDIT_CANDIDATE,
} from 'minterjs-tx/src/tx-types';

export function getFeeValue(txType, payloadLength = 0, {coinSymbolLength, multisendCount} = {}) {
    // txType to string
    if (typeof txType === 'number') {
        txType = `0x${txType.toString(16).toUpperCase()}`;
    }
    // multisendCount should be specified when txType is TX_TYPE_MULTISEND
    if (txType === TX_TYPE_MULTISEND && !multisendCount) {
        return false;
    }

    const baseUnits = BASE_FEES[txType];
    const COIN_UNIT = 0.001;
    const COIN_UNIT_PART = 1 / COIN_UNIT; // negate js math quirks, ex.: 18 * 0.001 = 0.018000000000000002
    // multisend fee = base fee + extra fee based on count
    const multisendExtraCountFee = txType === TX_TYPE_MULTISEND ? multisendCount * 5 : 0;
    // coin symbol extra fee, value in base coin (not in units)
    const coinSymbolFee = txType === TX_TYPE_CREATE_COIN ? getCoinSymbolFee(coinSymbolLength) : 0;
    return (baseUnits + payloadLength * 2 + multisendExtraCountFee) / COIN_UNIT_PART + coinSymbolFee;
}

//
/**
 * @param tickerLength
 * @return {number} - value in base coin (not in units)
 */
export function getCoinSymbolFee(tickerLength) {
    return COIN_SYMBOL_FEES[tickerLength] || 100;
}

// value in base coin (not in units)
// @See https://github.com/MinterTeam/minter-go-node/blob/master/core/transaction/create_coin.go#L93
export const COIN_SYMBOL_FEES = {
    3: 1000000,
    4: 100000,
    5: 10000,
    6: 1000,
};

/**
 * Tx fees in units
 * @type {{string: number}}
 */
export const BASE_FEES = {
    [TX_TYPE_SEND]: 10,
    [TX_TYPE_SELL]: 100,
    [TX_TYPE_SELL_ALL]: 100,
    [TX_TYPE_BUY]: 100,
    [TX_TYPE_CREATE_COIN]: 0,
    [TX_TYPE_DECLARE_CANDIDACY]: 10000,
    [TX_TYPE_DELEGATE]: 200,
    [TX_TYPE_UNBOND]: 200,
    [TX_TYPE_REDEEM_CHECK]: 30,
    [TX_TYPE_SET_CANDIDATE_ON]: 100,
    [TX_TYPE_SET_CANDIDATE_OFF]: 100,
    [TX_TYPE_CREATE_MULTISIG]: 100,
    [TX_TYPE_MULTISEND]: 10, // 10+(n-1)*5 units
    [TX_TYPE_EDIT_CANDIDATE]: 10000,
};
