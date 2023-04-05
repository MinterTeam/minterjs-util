import {
    Big, sellCoin, sellCoinByBip, buyCoin, buyCoinByCoin,
} from '~/src';

describe('coin math', () => {
    test('sellCoin', () => {
        expect(new Big(sellCoin({supply: 100, reserve: 1000, crr: 0.1}, 1)).toFixed(12)).toEqual('95.617924991196');
    });
    test('sellCoin crr 0', () => {
        expect(sellCoin({supply: 100, reserve: 1000, crr: 0}, 1)).toEqual('0');
    });
    test('sellCoin reserve 0', () => {
        expect(sellCoin({supply: 100, reserve: 0, crr: 0.1}, 1)).toEqual('0');
    });
    test('sellCoin supply 0', () => {
        expect(sellCoin({supply: 0, reserve: 1000, crr: 0.1}, 1)).toEqual('0');
    });

    test('sellCoinByBip', () => {
        expect(sellCoinByBip({supply: 100, reserve: 1000, crr: 0.1}, 1)).toEqual('0.01000450285207');
    });
    test('sellCoinByBip crr 0', () => {
        expect(sellCoinByBip({supply: 100, reserve: 1000, crr: 0}, 1)).toEqual('0');
    });
    test('sellCoinByBip reserve 0', () => {
        expect(sellCoinByBip({supply: 100, reserve: 0, crr: 0.1}, 1)).toEqual('0');
    });
    test('sellCoinByBip supply 0', () => {
        expect(sellCoinByBip({supply: 0, reserve: 1000, crr: 0.1}, 1)).toEqual('0');
    });

    test('buyCoin', () => {
        expect(buyCoin({supply: 100, reserve: 1000, crr: 0.1}, 1)).toEqual('0.00999550284793');
    });
    test('buyCoin crr 0', () => {
        expect(buyCoin({supply: 100, reserve: 1000, crr: 0}, 1)).toEqual('0');
    });
    test('buyCoin reserve 0', () => {
        expect(buyCoin({supply: 100, reserve: 0, crr: 0.1}, 1)).toEqual('0');
    });
    test('buyCoin supply 0', () => {
        expect(buyCoin({supply: 0, reserve: 1000, crr: 0.1}, 1)).toEqual('0');
    });

    test('buyCoinByCoin', () => {
        expect(new Big(buyCoinByCoin({supply: 100, reserve: 1000, crr: 0.1}, 1)).toFixed(12)).toEqual('104.622125411204');
    });
    test('buyCoinByCoin crr 0', () => {
        expect(buyCoinByCoin({supply: 100, reserve: 1000, crr: 0}, 1)).toEqual('0');
    });
    test('buyCoinByCoin reserve 0', () => {
        expect(buyCoinByCoin({supply: 100, reserve: 0, crr: 0.1}, 1)).toEqual('0');
    });
    test('buyCoinByCoin supply 0', () => {
        expect(buyCoinByCoin({supply: 0, reserve: 1000, crr: 0.1}, 1)).toEqual('0');
    });
});
