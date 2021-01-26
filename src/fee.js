import Big from 'big.js';
import {getBinarySize} from 'ethjs-util';
import {TX_TYPE, normalizeTxType} from './tx-types.js';
import {convertFromPip} from './converter.js';

/**
 * Accept current network fee values in pips.
 * Provide instance to calculate fee for particular transaction based on its params.
 *
 * @param {BaseFeeList} baseFeeList
 * @param {TickerFeeLest} tickerFeeList
 * @param {number|string} payloadByteFee
 * @param {number|string} multisendRecipientFee
 * @constructor
 */
export function BaseCoinFee({baseFeeList, tickerFeeList, payloadByteFee, multisendRecipientFee}) {
    if (typeof baseFeeList !== 'object') {
        throw new TypeError('Invalid baseFeeList specified');
    }
    if (typeof tickerFeeList !== 'object') {
        throw new TypeError('Invalid tickerFeeList specified');
    }
    if (typeof payloadByteFee === 'undefined') {
        throw new TypeError('payloadByteFee is undefined');
    }
    if (typeof multisendRecipientFee === 'undefined') {
        throw new TypeError('multisendRecipientFee is undefined');
    }

    this.baseFeeList = baseFeeList;
    this.tickerFeeList = tickerFeeList;
    this.payloadByteFee = payloadByteFee;
    this.multisendRecipientFee = multisendRecipientFee;

    /**
     * @param txType
     * @param {string|Buffer} [payload]
     * @param {number} [payloadLength]
     * @param {string} [coinSymbol]
     * @param {number} [coinSymbolLength]
     * @param {number} [multisendCount]
     * @return {number|string}
     */
    this.getFeeValue = (txType, {payload, payloadLength = 0, coinSymbol, coinSymbolLength, multisendCount} = {}) => {
        // txType to string
        txType = normalizeTxType(txType);

        if (txType === TX_TYPE.MULTISEND && !(multisendCount >= 1)) {
            throw new Error('`multisendCount` should be positive integer when tx type is TX_TYPE.MULTISEND');
        }

        if (Buffer.isBuffer(payload)) {
            payloadLength = payload.length;
        } else if (payload) {
            payloadLength = getBinarySize(payload.toString());
        }

        const baseFee = this.baseFeeList[txType];
        // multisend fee = base fee + extra fee based on count
        const multisendExtraCountFee = txType === TX_TYPE.MULTISEND ? new Big(multisendCount - 1).times(this.multisendRecipientFee) : 0;
        // coin symbol extra fee
        const tickerLengthFee = txType === TX_TYPE.CREATE_COIN || txType === TX_TYPE.CREATE_TOKEN ? this.getCoinSymbolFee(coinSymbol, coinSymbolLength) : 0;
        const payloadFee = new Big(this.payloadByteFee).times(payloadLength);

        return convertFromPip(new Big(baseFee).plus(payloadFee).plus(multisendExtraCountFee).plus(tickerLengthFee));
    };

    /**
     * @param {string} [ticker]
     * @param {number} [length]
     * @return {number|string} - value in pip
     */
    this.getCoinSymbolFee = (ticker, length) => {
        length = ticker ? ticker.length : length;
        if (!isValidLength(length)) {
            length = 7;
        }
        return this.tickerFeeList[length];

        // eslint-disable-next-line unicorn/consistent-function-scoping, no-shadow
        function isValidLength(length) {
            return length >= 3 && length <= 7;
        }
    };
}

/**
 * @typedef {Object} TickerFeeLest
 * @type {{'3': number|string, '4': number|string, '5': number|string, '6': number|string, '7': number|string}}
 */

/**
 * @typedef {Object} BaseFeeList
 * @type {{TX_TYPE: number|string}}
 */
