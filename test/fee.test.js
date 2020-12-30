import { getFeeValue, TX_TYPE, BASE_FEES } from '~/src';

describe('getFeeValue', () => {
    test('number tx type', () => {
        expect(getFeeValue(1)).toEqual(1);
    });

    test('send without payload', () => {
        expect(getFeeValue(TX_TYPE.SEND)).toEqual(1);
    });

    test('send with payload', () => {
        expect(getFeeValue(TX_TYPE.SEND, {payload: 'asd'})).toEqual(1.6);
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
