import {convert, convertToPip, convertFromPip} from '~/src';

describe('converter', () => {
    test('convert to pip', () => {
        const bips = 1.234;
        expect(convert(bips, 'pip')).toEqual('1234000000000000000');
    });

    test('bip to pip', () => {
        const bips = 1.234;
        expect(convertToPip(bips)).toEqual('1234000000000000000');
    });

    test('convert to bip', () => {
        const pips = 1234;
        expect(convert(pips, 'bip')).toEqual(('0.000000000000001234'));
    });

    test('pip to bip', () => {
        const pips = 1234;
        expect(convertFromPip(pips)).toEqual(('0.000000000000001234'));
    });

    test('convert 0x', () => {
        const bips = '0x';

        expect(convert(bips, 'pip')).toEqual('0');
    });

    test('convert hex', () => {
        const bips = '0xb';
        expect(convert(bips, 'pip')).toEqual('11000000000000000000');
        const bips2 = '0x0b';
        expect(convert(bips2, 'pip')).toEqual('11000000000000000000');
    });

    test('convert to hex', () => {
        expect(convert(1, 'pip', 'hex')).toEqual('0de0b6b3a7640000');
    });

    test('convert to hex should pad to even', () => {
        expect(convert('0.000000000000000011', 'pip', 'hex')).toEqual('0b');
    });

    test('do not produce exponential', () => {
        const bips = 1234567890;
        expect(convertToPip(bips)).toEqual('1234567890000000000000000000');
    });

    test('convert to unknown type fails', () => {
        const bips = 12345;

        expect(() => convert(bips, 'mnb')).toThrow();
    });

    test('convert to bip hex fails', () => {
        expect(() => convert(1, 'bip', 'hex')).toThrow();
    });

    test('convert invalid number fails', () => {
        const bips = '123asd';
        expect(() => convert(bips, 'pip')).toThrow();
    });

    test('rounding to nearest even', () => {
        expect(convert('0.000000000000000011', 'pip')).toEqual('11');
        expect(convert('0.000000000000000012', 'pip')).toEqual('12');
        expect(convert('0.0000000000000000111', 'pip')).toEqual('11');
        expect(convert('0.0000000000000000115', 'pip')).toEqual('12');
        expect(convert('0.0000000000000000119', 'pip')).toEqual('12');
        expect(convert('0.0000000000000000121', 'pip')).toEqual('12');
        expect(convert('0.0000000000000000125', 'pip')).toEqual('12');
        expect(convert('0.0000000000000000129', 'pip')).toEqual('13');
        expect(convert('0.000000000000000013', 'pip')).toEqual('13');
        expect(convert('0.0000000000000000131', 'pip')).toEqual('13');

        expect(convert('0.1', 'bip')).toEqual('0');
        expect(convert('0.9', 'bip')).toEqual('0.000000000000000001');
        expect(convert('1', 'bip')).toEqual('0.000000000000000001');
        expect(convert('1.1', 'bip')).toEqual('0.000000000000000001');
        expect(convert('1.5', 'bip')).toEqual('0.000000000000000002');
        expect(convert('1.9', 'bip')).toEqual('0.000000000000000002');
        expect(convert('2.5', 'bip')).toEqual('0.000000000000000002');
    });
});
