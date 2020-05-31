import {normalizeTxType, TX_TYPE, txTypeList} from '~/src';

describe('txTypeList', () => {
    test.each(Object.values(TX_TYPE))('should work %s', (typeHex) => {
        const typeItem = txTypeList[Number(typeHex)];

        expect(typeItem.hex).toEqual(typeHex);
        expect(typeItem.number).toEqual(Number(typeHex));
        expect(typeItem.name.length).toBeGreaterThan(0);
    });
});

describe('coinToBuffer', () => {
    test('from array', () => {
        expect(normalizeTxType([13])).toEqual(TX_TYPE.MULTISEND);
    });
    test('from number', () => {
        expect(normalizeTxType(13)).toEqual(TX_TYPE.MULTISEND);
    });
    test('from invalid string ', () => {
        expect(normalizeTxType('13')).toEqual(TX_TYPE.MULTISEND);
    });
    test('from lowercase string ', () => {
        expect(normalizeTxType('0x0d')).toEqual(TX_TYPE.MULTISEND);
    });
    test('from uppercase string ', () => {
        expect(normalizeTxType('0X0D')).toEqual(TX_TYPE.MULTISEND);
    });
});
