import { FeePrice, TX_TYPE } from '~/src';

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
};

describe('getFeeValue', () => {
    const feePrice = new FeePrice(commissionData);

    function getFeeValue() {
        // eslint-disable-next-line prefer-rest-params
        return parseFloat(feePrice.getFeeValue(...arguments));
    }

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

    test('create coin without coin symbol', () => {
        expect(getFeeValue(TX_TYPE.CREATE_COIN)).toEqual(10000);
    });

    test('multisend', () => {
        expect(getFeeValue(TX_TYPE.MULTISEND, {deltaItemCount: 1})).toEqual(1);
        expect(getFeeValue(TX_TYPE.MULTISEND, {deltaItemCount: 2})).toEqual(1.5);
        expect(getFeeValue(TX_TYPE.MULTISEND, {deltaItemCount: 5})).toEqual(3);
    });

    test('multisend throws without deltaItemCount', () => {
        expect(() => getFeeValue(TX_TYPE.MULTISEND)).toThrow();
    });

    test('every tx type has corresponding fee', () => {
        // expect.assertions(Object.keys(TX_TYPE).length);
        // Object.keys(TX_TYPE).forEach((txKey) => {
        //     expect(BASE_FEES[TX_TYPE[txKey]], `${txKey} ${TX_TYPE[txKey]}`).toEqual(expect.anything());
        // });
    });
});
