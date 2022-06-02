import Big from 'big.js';
import {getBinarySize} from 'ethjs-util';
import {TX_TYPE, normalizeTxType, txTypeList} from './tx-types.js';
import {convertFromPip} from './converter.js';

/**
 * Accept current network fee values in pips.
 * Provide instance to calculate fee for particular transaction based on its params.
 *
 * @param {CommissionPriceData} commissionPriceData
 * @constructor
 */
export function FeePrice(commissionPriceData) {
    const {baseFeeList, deltaFeeList, tickerFeeList, payloadByteFee} = mapApiData(commissionPriceData);

    this.baseFeeList = baseFeeList;
    this.deltaFeeList = deltaFeeList;
    this.tickerFeeList = tickerFeeList;
    this.payloadByteFee = payloadByteFee;

    /**
     * @param {TX_TYPE} txType
     * @param {FeePriceOptions} [options]
     * @return {number|string}
     */
    this.getFeeValue = (txType, {payload, payloadLength = 0, coinSymbol, coinSymbolLength, deltaItemCount, fallbackOnInvalidInput} = {}) => {
        // txType to string
        txType = normalizeTxType(txType);

        const isDeltaType = txType === TX_TYPE.MULTISEND || txType === TX_TYPE.BUY_SWAP_POOL || txType === TX_TYPE.SELL_SWAP_POOL || txType === TX_TYPE.SELL_ALL_SWAP_POOL;
        if (isDeltaType && !(deltaItemCount >= 1)) {
            if (fallbackOnInvalidInput) {
                deltaItemCount = 1;
            } else {
                throw new Error(`\`deltaItemCount\` should be positive integer when tx type is ${txType} (${txTypeList[Number(txType)].name})`);
            }
        }

        if (Buffer.isBuffer(payload)) {
            payloadLength = payload.length;
        } else if (payload) {
            payloadLength = getBinarySize(payload.toString());
        }

        let baseFee = this.baseFeeList[txType];
        if (isFeeInvalid(baseFee)) {
            // eslint-disable-next-line no-console
            console.warn(`No base commission price specified for ${txType} tx type (${txTypeList[Number(txType)].name})`);
            baseFee = 0;
        }
        let deltaFee = this.deltaFeeList[txType];
        if (isDeltaType && isFeeInvalid(deltaFee)) {
            // eslint-disable-next-line no-console
            console.warn(`No delta commission price specified for ${txType} tx type (${txTypeList[Number(txType)].name})`);
            deltaFee = 0;
        }
        // extra fee based on count
        const deltaTotalFee = isDeltaType ? new Big(deltaItemCount - 1).times(deltaFee) : 0;
        // coin symbol extra fee
        const tickerLengthFee = txType === TX_TYPE.CREATE_COIN || txType === TX_TYPE.CREATE_TOKEN ? this.getCoinSymbolFee(coinSymbol, coinSymbolLength, fallbackOnInvalidInput) : 0;
        const payloadFee = new Big(this.payloadByteFee).times(payloadLength);

        return convertFromPip(new Big(baseFee).plus(payloadFee).plus(deltaTotalFee).plus(tickerLengthFee));
    };

    /**
     * @param {string} [ticker]
     * @param {number} [length]
     * @param {boolean} [fallbackOnInvalidInput]
     * @return {number|string} - value in pip
     */
    this.getCoinSymbolFee = (ticker, length, fallbackOnInvalidInput) => {
        length = ticker ? ticker.length : length;
        if (!isValidLength(length)) {
            if (fallbackOnInvalidInput) {
                length = 7;
            } else {
                throw new Error('Coin symbol length should be between 3 and 10');
            }
        }
        return this.tickerFeeList[length];

        // eslint-disable-next-line unicorn/consistent-function-scoping, no-shadow
        function isValidLength(length) {
            return length >= 3 && length <= 10;
        }
    };
}

function isFeeInvalid(fee) {
    return (typeof fee !== 'number' && typeof fee !== 'string') || (typeof fee === 'string' && fee.length === 0);
}

/**
 * @typedef {object} FeePriceOptions
 * @property {string|Buffer} [payload]
 * @property {number} [payloadLength]
 * @property {string} [coinSymbol]
 * @property {number} [coinSymbolLength]
 * @property {number} [deltaItemCount]
 * @property {boolean} [fallbackOnInvalidInput]
 */

/**
 * @typedef {Object} TickerFeeList
 * @type {{'3': number|string, '4': number|string, '5': number|string, '6': number|string, '7': number|string, '8': number|string, '9': number|string, '10': number|string}}
 */

/**
 * @typedef {Object} FeeList
 * @type {{TX_TYPE: number|string}}
 */

/**
 * @param {CommissionPriceData} data
 * @return {CommissionPriceMapped}
 */
function mapApiData(data) {
    const coin = data.coin;
    const payloadByteFee = data.payload_byte;
    const tickerFeeList = {
        3: data.create_ticker3,
        4: data.create_ticker4,
        5: data.create_ticker5,
        6: data.create_ticker6,
        7: data.create_ticker7_10,
        8: data.create_ticker7_10,
        9: data.create_ticker7_10,
        10: data.create_ticker7_10,
    };
    const customKeysFeeList = {
        [TX_TYPE.SELL]: data.sell_bancor,
        [TX_TYPE.SELL_ALL]: data.sell_all_bancor,
        [TX_TYPE.BUY]: data.buy_bancor,
        [TX_TYPE.MULTISEND]: data.multisend_base,
        [TX_TYPE.SELL_SWAP_POOL]: data.sell_pool_base,
        [TX_TYPE.BUY_SWAP_POOL]: data.buy_pool_base,
        [TX_TYPE.SELL_ALL_SWAP_POOL]: data.sell_all_pool_base,
    };
    function getBaseFeeForTypeItem(typeItem) {
        return customKeysFeeList[typeItem.hex] || data[typeItem.key];
    }
    const baseFeeListEntries = txTypeList
        .map((typeItem) => [typeItem.hex, getBaseFeeForTypeItem(typeItem)])
        .filter((item) => !!item);
    const baseFeeList = Object.fromEntries(baseFeeListEntries);
    const deltaFeeList = {
        [TX_TYPE.MULTISEND]: data.multisend_delta,
        [TX_TYPE.SELL_SWAP_POOL]: data.sell_pool_delta,
        [TX_TYPE.BUY_SWAP_POOL]: data.buy_pool_delta,
        [TX_TYPE.SELL_ALL_SWAP_POOL]: data.sell_all_pool_delta,
    };

    return {
        coin,
        baseFeeList,
        deltaFeeList,
        tickerFeeList,
        payloadByteFee,
    };
}

/**
 * @typedef {Object} CommissionPriceMapped
 * @property {Coin} coin
 * @property {FeeList} baseFeeList
 * @property {FeeList} deltaFeeList
 * @property {TickerFeeList} tickerFeeList
 * @property {number|string} payloadByteFee
 */

/**
 * @typedef {Object} CommissionPriceData
 * @property {Coin} coin
 * @property {string|number} payload_byte
 * @property {string|number} send
 * @property {string|number} buy_bancor
 * @property {string|number} sell_bancor
 * @property {string|number} sell_all_bancor
 * @property {string|number} buy_pool_base
 * @property {string|number} buy_pool_delta
 * @property {string|number} sell_pool_base
 * @property {string|number} sell_pool_delta
 * @property {string|number} sell_all_pool_base
 * @property {string|number} sell_all_pool_delta
 * @property {string|number} create_ticker3
 * @property {string|number} create_ticker4
 * @property {string|number} create_ticker5
 * @property {string|number} create_ticker6
 * @property {string|number} create_ticker7_10
 * @property {string|number} create_coin
 * @property {string|number} create_token
 * @property {string|number} recreate_coin
 * @property {string|number} recreate_token
 * @property {string|number} declare_candidacy
 * @property {string|number} delegate
 * @property {string|number} unbond
 * @property {string|number} redeem_check
 * @property {string|number} set_candidate_on
 * @property {string|number} set_candidate_off
 * @property {string|number} create_multisig
 * @property {string|number} multisend_delta
 * @property {string|number} multisend_base
 * @property {string|number} edit_candidate
 * @property {string|number} set_halt_block
 * @property {string|number} edit_ticker_owner
 * @property {string|number} edit_multisig
 * @property {string|number} [price_vote]
 * @property {string|number} edit_candidate_public_key
 * @property {string|number} add_liquidity
 * @property {string|number} remove_liquidity
 * @property {string|number} edit_candidate_commission
 * @property {string|number} move_stake
 * @property {string|number} mint_token
 * @property {string|number} burn_token
 * @property {string|number} vote_commission
 * @property {string|number} vote_update
 * @property {string|number} create_swap_pool
 * @property {string|number} failed_tx
 * @property {string|number} add_limit_order
 * @property {string|number} remove_limit_order
 * @property {string|number} lock_stake
 * @property {string|number} lock
 */
