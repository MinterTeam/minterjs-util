import {convert, convertToPip, convertFromPip} from '~/src/converter';

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
        expect(convert(1, 'pip', 'hex')).toEqual('de0b6b3a7640000');
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
});
