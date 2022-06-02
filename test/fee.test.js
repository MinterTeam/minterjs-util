import { FeePrice, TX_TYPE, txTypeList } from '~/src';

const commissionData = {
    coin: {id: '0', symbol: 'MNT'},
    payload_byte: '200000000000000000',
    send: '1000000000000000000',
    buy_bancor: '10000000000000000000',
    sell_bancor: '10000000000000000000',
    sell_all_bancor: '10000000000000000000',
    buy_pool_base: '10000000000000000000',
    buy_pool_delta: '5000000000000000000',
    sell_pool_base: '10000000000000000000',
    sell_pool_delta: '5000000000000000000',
    sell_all_pool_base: '10000000000000000000',
    sell_all_pool_delta: '5000000000000000000',
    create_ticker3: '100000000000000000000000000',
    create_ticker4: '10000000000000000000000000',
    create_ticker5: '1000000000000000000000000',
    create_ticker6: '100000000000000000000000',
    create_ticker7_10: '10000000000000000000000',
    create_coin: '0',
    create_token: '0',
    recreate_coin: '1000000000000000000000000',
    recreate_token: '1000000000000000000000000',
    declare_candidacy: '1000000000000000000000',
    delegate: '20000000000000000000',
    unbond: '20000000000000000000',
    redeem_check: '3000000000000000000',
    set_candidate_on: '10000000000000000000',
    set_candidate_off: '10000000000000000000',
    create_multisig: '10000000000000000000',
    multisend_base: '1000000000000000000',
    multisend_delta: '500000000000000000',
    edit_candidate: '1000000000000000000000',
    set_halt_block: '100000000000000000000',
    edit_ticker_owner: '1000000000000000000000000',
    edit_multisig: '100000000000000000000',
    price_vote: '1000000000000000000',
    edit_candidate_public_key: '10000000000000000000000000',
    create_swap_pool: '100000000000000000000',
    add_liquidity: '10000000000000000000',
    remove_liquidity: '10000000000000000000',
    edit_candidate_commission: '1000000000000000000000',
    move_stake: '20000000000000000000',
    mint_token: '10000000000000000000',
    burn_token: '10000000000000000000',
    vote_commission: '100000000000000000000',
    vote_update: '100000000000000000000',
    add_limit_order: '100000000000000000000',
    remove_limit_order: '100000000000000000000',
    lock_stake: '20000000000000000000',
    lock: '20000000000000000000',
};

const feePrice = new FeePrice(commissionData);
/**
 * @param {TX_TYPE} txType
 * @param {FeePriceOptions} [options]
 * @return {number|string}
 */
function getFeeValue(txType, options) {
    // eslint-disable-next-line prefer-rest-params
    return parseFloat(feePrice.getFeeValue(txType, options));
}

describe('getFeeValue', () => {
    test('number tx type', () => {
        expect(getFeeValue(1)).toEqual(1);
    });

    test('send without payload', () => {
        expect(getFeeValue(TX_TYPE.SEND)).toEqual(1);
    });

    test('send with payload', () => {
        expect(getFeeValue(TX_TYPE.SEND, {payload: 'asd'})).toEqual(1.6);
        expect(getFeeValue(TX_TYPE.SEND, {payloadLength: 25})).toEqual(6);
    });

    test('send with unicode payload', () => {
        expect(getFeeValue(TX_TYPE.SEND, {payload: 'asé'})).toEqual(1.8);
    });

    test('create coin', () => {
        expect(getFeeValue(TX_TYPE.CREATE_COIN, {coinSymbol: 'ABCDEFG'})).toEqual(10_000);
        expect(getFeeValue(TX_TYPE.CREATE_COIN, {coinSymbol: 'ABCDEFGHIJ'})).toEqual(10_000);
        expect(getFeeValue(TX_TYPE.CREATE_COIN, {coinSymbol: 'ABC'})).toEqual(100_000_000);
        expect(getFeeValue(TX_TYPE.CREATE_COIN, {coinSymbolLength: 4})).toEqual(10_000_000);
    });

    test('invalid create coin', () => {
        expect(() => getFeeValue(TX_TYPE.CREATE_COIN)).toThrow();
        expect(() => getFeeValue(TX_TYPE.CREATE_COIN, {coinSymbol: 'A'})).toThrow();
        expect(() => getFeeValue(TX_TYPE.CREATE_COIN, {coinSymbol: 'AB'})).toThrow();
        expect(() => getFeeValue(TX_TYPE.CREATE_COIN, {coinSymbol: 'A1234567890'})).toThrow();
    });

    test('invalid create coin with fallback', () => {
        expect(getFeeValue(TX_TYPE.CREATE_COIN, {fallbackOnInvalidInput: true})).toEqual(10000);
        expect(getFeeValue(TX_TYPE.CREATE_COIN, {fallbackOnInvalidInput: true, coinSymbol: 'A'})).toEqual(10000);
        expect(getFeeValue(TX_TYPE.CREATE_COIN, {fallbackOnInvalidInput: true, coinSymbol: 'AB'})).toEqual(10000);
        expect(getFeeValue(TX_TYPE.CREATE_COIN, {fallbackOnInvalidInput: true, coinSymbol: 'A1234567890'})).toEqual(10000);
        expect(getFeeValue(TX_TYPE.CREATE_COIN, {fallbackOnInvalidInput: true, coinSymbolLength: 11})).toEqual(10000);
    });

    test('multisend', () => {
        expect(getFeeValue(TX_TYPE.MULTISEND, {deltaItemCount: 1})).toEqual(1);
        expect(getFeeValue(TX_TYPE.MULTISEND, {deltaItemCount: 2})).toEqual(1.5);
        expect(getFeeValue(TX_TYPE.MULTISEND, {deltaItemCount: 5})).toEqual(3);
    });

    test('invalid multisend', () => {
        expect(() => getFeeValue(TX_TYPE.MULTISEND)).toThrow();
        expect(() => getFeeValue(TX_TYPE.MULTISEND, {deltaItemCount: 0})).toThrow();
    });

    test('invalid multisend with fallback', () => {
        expect(getFeeValue(TX_TYPE.MULTISEND, {fallbackOnInvalidInput: true})).toEqual(1);
        expect(getFeeValue(TX_TYPE.MULTISEND, {fallbackOnInvalidInput: true, deltaItemCount: 0})).toEqual(1);
    });

    test('swap pool', () => {
        expect(getFeeValue(TX_TYPE.SELL_SWAP_POOL, {deltaItemCount: 1})).toEqual(10);
        expect(getFeeValue(TX_TYPE.SELL_SWAP_POOL, {deltaItemCount: 2})).toEqual(15);
        expect(getFeeValue(TX_TYPE.SELL_SWAP_POOL, {deltaItemCount: 5})).toEqual(30);
    });

    test('invalid swap pool', () => {
        expect(() => getFeeValue(TX_TYPE.SELL_SWAP_POOL)).toThrow();
        expect(() => getFeeValue(TX_TYPE.SELL_SWAP_POOL, {deltaItemCount: 0})).toThrow();
    });

    test('invalid swap pool with fallback', () => {
        expect(getFeeValue(TX_TYPE.SELL_SWAP_POOL, {fallbackOnInvalidInput: true})).toEqual(10);
        expect(getFeeValue(TX_TYPE.SELL_SWAP_POOL, {fallbackOnInvalidInput: true, deltaItemCount: 0})).toEqual(10);
    });
});

/** @type {Array<TxTypeItem>} */
const typeList = txTypeList
    .filter((typeItem) => !typeItem.isDisabled)
    .map((typeItem) => {
        return {
            ...typeItem,
            toString: () => `${typeItem.hex} ${typeItem.key}`,
        };
    });

describe('each tx type', () => {
    describe.each(typeList)('%s', ({hex: txType, key: txKey}) => {
        test('baseFeeList have value', () => {
            // console.log(txKey, txType, feePrice.baseFeeList[txType]);
            expect(feePrice.baseFeeList[txType]).toEqual(expect.anything());
        });

        test('getFeeValue returns valid value', () => {
            // console.log(txKey, txType, getFeeValue(txType, {fallbackOnInvalidInput: true}));
            expect(getFeeValue(txType, {fallbackOnInvalidInput: true})).toBeGreaterThan(0);
        });
    });
});
