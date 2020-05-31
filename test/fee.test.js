import { getFeeValue, TX_TYPE } from '~/src';

describe('getFeeValue', () => {
    test('number tx type', () => {
        expect(getFeeValue(1)).toEqual(0.01);
    });

    test('send without payload', () => {
        expect(getFeeValue(TX_TYPE.SEND)).toEqual(0.01);
    });

    test('send with payload', () => {
        expect(getFeeValue(TX_TYPE.SEND, {payload: 'asd'})).toEqual(0.016);
    });

    test('send with unicode payload', () => {
        expect(getFeeValue(TX_TYPE.SEND, {payload: 'asé'})).toEqual(0.018);
    });

    test('create coin', () => {
        expect(getFeeValue(TX_TYPE.CREATE_COIN, {coinSymbol: 'ABCDEFG'})).toEqual(100);
        expect(getFeeValue(TX_TYPE.CREATE_COIN, {coinSymbol: 'ABCDEFGHIJ'})).toEqual(100);
        expect(getFeeValue(TX_TYPE.CREATE_COIN, {coinSymbol: 'ABC'})).toEqual(1000000);
    });

    test('create coin without coinSymbolLength', () => {
        expect(getFeeValue(TX_TYPE.CREATE_COIN)).toEqual(100);
    });

    test('multisend', () => {
        expect(getFeeValue(TX_TYPE.MULTISEND, {multisendCount: 1})).toEqual(0.01);
        expect(getFeeValue(TX_TYPE.MULTISEND, {multisendCount: 2})).toEqual(0.015);
        expect(getFeeValue(TX_TYPE.MULTISEND, {multisendCount: 5})).toEqual(0.03);
    });

    test('multisend throws without multisendCount', () => {
        expect(() => getFeeValue(TX_TYPE.MULTISEND)).toThrow();
    });
});
