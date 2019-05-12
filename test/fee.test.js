import {TX_TYPE_SEND, TX_TYPE_CREATE_COIN, TX_TYPE_MULTISEND} from 'minterjs-tx';
import { getFeeValue } from '~/src';

describe('getFeeValue', () => {
    test('send without payload', () => {
        expect(getFeeValue(TX_TYPE_SEND)).toEqual(0.01);
    });

    test('send with payload', () => {
        expect(getFeeValue(TX_TYPE_SEND, 3)).toEqual(0.016);
    });

    test('create coin', () => {
        expect(getFeeValue(TX_TYPE_CREATE_COIN, 0, {coinSymbolLength: 7})).toEqual(100);
        expect(getFeeValue(TX_TYPE_CREATE_COIN, 0, {coinSymbolLength: 10})).toEqual(100);
        expect(getFeeValue(TX_TYPE_CREATE_COIN, 0, {coinSymbolLength: 3})).toEqual(1000000);
    });

    test('create coin throws without coinSymbolLength', () => {
        expect(getFeeValue(TX_TYPE_CREATE_COIN, 0)).toEqual(false);
    });

    test('multisend', () => {
        expect(getFeeValue(TX_TYPE_MULTISEND, 0, {multisendCount: 5})).toEqual(0.035);
    });

    test('multisend throws without multisendCount', () => {
        expect(getFeeValue(TX_TYPE_MULTISEND, 0)).toEqual(false);
    });
});
