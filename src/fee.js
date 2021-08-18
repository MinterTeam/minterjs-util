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
    this.getFeeValue = (txType, {payload, payloadLength = 0, coinSymbol, coinSymbolLength, deltaItemCount} = {}) => {
        // txType to string
        txType = normalizeTxType(txType);

        const isDeltaType = txType === TX_TYPE.MULTISEND || txType === TX_TYPE.BUY_SWAP_POOL || txType === TX_TYPE.SELL_SWAP_POOL || txType === TX_TYPE.SELL_ALL_SWAP_POOL;
        if (isDeltaType && !(deltaItemCount >= 1)) {
            throw new Error(`\`deltaItemCount\` should be positive integer when tx type is ${txType} (${txTypeList[Number(txType)].name})`);
        }

        if (Buffer.isBuffer(payload)) {
            payloadLength = payload.length;
        } else if (payload) {
            payloadLength = getBinarySize(payload.toString());
        }

        let baseFee = this.baseFeeList[txType];
        if (isFeeInvalid(baseFee)) {
            console.warn(`No base commission price specified for ${txType} tx type (${txTypeList[Number(txType)].name})`);
            baseFee = 0;
        }
        let deltaFee = this.deltaFeeList[txType];
        if (isDeltaType && isFeeInvalid(deltaFee)) {
            console.warn(`No delta commission price specified for ${txType} tx type (${txTypeList[Number(txType)].name})`);
            deltaFee = 0;
        }
        // extra fee based on count
        const deltaTotalFee = isDeltaType ? new Big(deltaItemCount - 1).times(deltaFee) : 0;
        // coin symbol extra fee
        const tickerLengthFee = txType === TX_TYPE.CREATE_COIN || txType === TX_TYPE.CREATE_TOKEN ? this.getCoinSymbolFee(coinSymbol, coinSymbolLength) : 0;
        const payloadFee = new Big(this.payloadByteFee).times(payloadLength);

        return convertFromPip(new Big(baseFee).plus(payloadFee).plus(deltaTotalFee).plus(tickerLengthFee));
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

function isFeeInvalid(fee) {
    return (typeof fee !== 'number' && typeof fee !== 'string') || (typeof fee === 'string' && fee.length === 0);
}

/**
 * @typedef {Object} FeePriceOptions
 * @param {string|Buffer} [payload]
 * @param {number} [payloadLength]
 * @param {string} [coinSymbol]
 * @param {number} [coinSymbolLength]
 * @param {number} [deltaItemCount]
 */

/**
 * @typedef {Object} TickerFeeList
 * @type {{'3': number|string, '4': number|string, '5': number|string, '6': number|string, '7': number|string}}
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
    };
    const baseFeeList = {
        [TX_TYPE.SEND]: data.send,
        [TX_TYPE.SELL]: data.sell_bancor,
        [TX_TYPE.SELL_ALL]: data.sell_all_bancor,
        [TX_TYPE.BUY]: data.buy_bancor,
        [TX_TYPE.CREATE_COIN]: data.create_coin,
        [TX_TYPE.DECLARE_CANDIDACY]: data.declare_candidacy,
        [TX_TYPE.DELEGATE]: data.delegate,
        [TX_TYPE.UNBOND]: data.unbond,
        [TX_TYPE.REDEEM_CHECK]: data.redeem_check,
        [TX_TYPE.SET_CANDIDATE_ON]: data.set_candidate_on,
        [TX_TYPE.SET_CANDIDATE_OFF]: data.set_candidate_off,
        [TX_TYPE.CREATE_MULTISIG]: data.create_multisig,
        [TX_TYPE.MULTISEND]: data.multisend_base,
        [TX_TYPE.EDIT_CANDIDATE]: data.edit_candidate,
        [TX_TYPE.SET_HALT_BLOCK]: data.set_halt_block,
        [TX_TYPE.RECREATE_COIN]: data.recreate_coin,
        [TX_TYPE.EDIT_TICKER_OWNER]: data.edit_ticker_owner,
        [TX_TYPE.EDIT_MULTISIG]: data.edit_multisig,
        [TX_TYPE.PRICE_VOTE]: data.price_vote,
        [TX_TYPE.EDIT_CANDIDATE_PUBLIC_KEY]: data.edit_candidate_public_key,
        [TX_TYPE.ADD_LIQUIDITY]: data.add_liquidity,
        [TX_TYPE.REMOVE_LIQUIDITY]: data.remove_liquidity,
        [TX_TYPE.SELL_SWAP_POOL]: data.sell_pool_base,
        [TX_TYPE.BUY_SWAP_POOL]: data.buy_pool_base,
        [TX_TYPE.SELL_ALL_SWAP_POOL]: data.sell_all_pool_base,
        [TX_TYPE.EDIT_CANDIDATE_COMMISSION]: data.edit_candidate_commission,
        [TX_TYPE.MOVE_STAKE]: data.move_stake,
        [TX_TYPE.MINT_TOKEN]: data.mint_token,
        [TX_TYPE.BURN_TOKEN]: data.burn_token,
        [TX_TYPE.CREATE_TOKEN]: data.create_token,
        [TX_TYPE.RECREATE_TOKEN]: data.recreate_token,
        [TX_TYPE.VOTE_COMMISSION]: data.vote_commission,
        [TX_TYPE.VOTE_UPDATE]: data.vote_update,
        [TX_TYPE.CREATE_SWAP_POOL]: data.create_swap_pool,
        [TX_TYPE.ADD_LIMIT_ORDER]: data.add_limit_order,
        [TX_TYPE.REMOVE_LIMIT_ORDER]: data.remove_limit_order,
    };
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
 * @property {string|number} [move_stake]
 * @property {string|number} mint_token
 * @property {string|number} burn_token
 * @property {string|number} vote_commission
 * @property {string|number} vote_update
 * @property {string|number} create_swap_pool
 * @property {string|number} failed_tx
 * @property {string|number} add_limit_order
 * @property {string|number} remove_limit_order
 */
