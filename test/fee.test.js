import { BaseCoinFee, TX_TYPE } from '~/src';

const TICKER_LENGTH_FEES = {
    3: 100000000_000_000_000_000_000_000,
    4: 10000000_000_000_000_000_000_000,
    5: 1000000_000_000_000_000_000_000,
    6: 100000_000_000_000_000_000_000,
    7: 10000_000_000_000_000_000_000,
};

const BASE_FEES = {
    [TX_TYPE.SEND]: 1_000_000_000_000_000_000,
    [TX_TYPE.SELL]: 10_000_000_000_000_000_000,
    [TX_TYPE.SELL_ALL]: 10_000_000_000_000_000_000, // same as SELL
    [TX_TYPE.BUY]: 10_000_000_000_000_000_000, // same as SELL
    [TX_TYPE.CREATE_COIN]: 0,
    [TX_TYPE.DECLARE_CANDIDACY]: 1000_000_000_000_000_000_000,
    [TX_TYPE.DELEGATE]: 20_000_000_000_000_000_000,
    [TX_TYPE.UNBOND]: 20_000_000_000_000_000_000, // same as DELEGATE
    [TX_TYPE.REDEEM_CHECK]: 3_000_000_000_000_000_000, // SEND * 3
    [TX_TYPE.SET_CANDIDATE_ON]: 10_000_000_000_000_000_000,
    [TX_TYPE.SET_CANDIDATE_OFF]: 10_000_000_000_000_000_000,
    [TX_TYPE.CREATE_MULTISIG]: 10_000_000_000_000_000_000,
    [TX_TYPE.MULTISEND]: 1_000_000_000_000_000_000, // 10+(n-1)*5 units
    [TX_TYPE.EDIT_CANDIDATE]: 1000_000_000_000_000_000_000,
    [TX_TYPE.SET_HALT_BLOCK]: 100_000_000_000_000_000_000,
    [TX_TYPE.RECREATE_COIN]: 1000000_000_000_000_000_000_000,
    [TX_TYPE.EDIT_TICKER_OWNER]: 1000000_000_000_000_000_000_000,
    [TX_TYPE.EDIT_MULTISIG]: 100_000_000_000_000_000_000,
    [TX_TYPE.PRICE_VOTE]: 1_000_000_000_000_000_000,
    [TX_TYPE.EDIT_CANDIDATE_PUBLIC_KEY]: 10000000_000_000_000_000_000_000,
    [TX_TYPE.ADD_LIQUIDITY]: 10_000_000_000_000_000_000,
    [TX_TYPE.REMOVE_LIQUIDITY]: 10_000_000_000_000_000_000,
    [TX_TYPE.SELL_SWAP_POOL]: 10_000_000_000_000_000_000, // same as SELL
    [TX_TYPE.BUY_SWAP_POOL]: 10_000_000_000_000_000_000, // same as SELL
    [TX_TYPE.SELL_ALL_SWAP_POOL]: 10_000_000_000_000_000_000, // same as SELL
    [TX_TYPE.EDIT_CANDIDATE_COMMISSION]: 1000_000_000_000_000_000_000,
    [TX_TYPE.MOVE_STAKE]: 20_000_000_000_000_000_000, // DELEGATE * 3
    [TX_TYPE.MINT_TOKEN]: 10_000_000_000_000_000_000, // same as SELL
    [TX_TYPE.BURN_TOKEN]: 10_000_000_000_000_000_000, // same as SELL
    [TX_TYPE.CREATE_TOKEN]: 0, // same as CREATE_COIN
    [TX_TYPE.RECREATE_TOKEN]: 1000000_000_000_000_000_000_000, // same as RECREATE_COIN
    [TX_TYPE.VOTE_COMMISSION]: 100_000_000_000_000_000_000,
    [TX_TYPE.VOTE_NETWORK]: 100_000_000_000_000_000_000,
    [TX_TYPE.CREATE_SWAP_POOL]: 1000_000_000_000_000_000_000,
};

describe('getFeeValue', () => {
    const baseCoinFee = new BaseCoinFee({
        baseFeeList: BASE_FEES,
        tickerFeeList: TICKER_LENGTH_FEES,
        payloadByteFee: '200000000000000000',
        multisendRecipientFee: '500000000000000000',
    });

    function getFeeValue() {
        // eslint-disable-next-line prefer-rest-params
        return parseFloat(baseCoinFee.getFeeValue(...arguments));
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
        expect(getFeeValue(TX_TYPE.MULTISEND, {multisendCount: 1})).toEqual(1);
        expect(getFeeValue(TX_TYPE.MULTISEND, {multisendCount: 2})).toEqual(1.5);
        expect(getFeeValue(TX_TYPE.MULTISEND, {multisendCount: 5})).toEqual(3);
    });

    test('multisend throws without multisendCount', () => {
        expect(() => getFeeValue(TX_TYPE.MULTISEND)).toThrow();
    });

    test('every tx type has corresponding fee', () => {
        expect.assertions(Object.keys(TX_TYPE).length);
        Object.keys(TX_TYPE).forEach((txKey) => {
            expect(BASE_FEES[TX_TYPE[txKey]], `${txKey} ${TX_TYPE[txKey]}`).toEqual(expect.anything());
        });
    });
});
