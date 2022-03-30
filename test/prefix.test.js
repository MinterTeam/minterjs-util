import { mPrefixToHex, mPrefixStrip, mToBuffer, toBuffer, addressToString, checkToString, privateToAddressString, isMinterPrefixed, isValidPublicKeyString, isValidAddress, isValidCheck, isValidTransaction } from '~/src';

describe('prefix', () => {
    test('mPrefixToHex', () => {
        expect(mPrefixToHex('Mx00')).toEqual('0x00');
    });

    test('mPrefixStrip', () => {
        expect(mPrefixStrip('Mx00')).toEqual('00');
    });

    test('mToBuffer', () => {
        expect(mToBuffer('Mx00').toString('hex')).toEqual('00');
    });

    test('toBuffer', () => {
        expect(toBuffer('Mx00').toString('hex')).toEqual('00');
        expect(toBuffer('0x00').toString('hex')).toEqual('00');
    });

    test('addressToString', () => {
        expect(addressToString(Buffer.from('01', 'hex'))).toEqual('Mx01');
    });

    test('checkToString', () => {
        expect(checkToString(Buffer.from('01', 'hex'))).toEqual('Mc01');
    });

    test('privateToAddressString', () => {
        const PRIVATE_KEY = Buffer.from('5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da', 'hex');
        expect(privateToAddressString(PRIVATE_KEY)).toEqual('Mx7633980c000139dd3bd24a3f54e06474fa941e16');
    });

    describe('isMinterPrefixed', () => {
        test('works', () => {
            expect(isMinterPrefixed('Mx01')).toEqual(true);
            expect(isMinterPrefixed('0x01')).toEqual(false);
            expect(isMinterPrefixed('01')).toEqual(false);
        });
        test('prefix without value', () => {
            expect(isMinterPrefixed('Mx')).toEqual(true);
        });
    });

    test('isValidPublicKeyString', () => {
        expect(isValidPublicKeyString('Mp1234567890123456789012345678901234567890123456789012345678901234')).toEqual(true);
        expect(isValidPublicKeyString('Mc1234567890123456789012345678901234567890123456789012345678901234')).toEqual(false);
        expect(isValidPublicKeyString('Mp12345678901234567890123456789012345678901234567890123456789012345')).toEqual(false);
    });

    test('isValidAddress', () => {
        expect(isValidAddress('Mx1234567890123456789012345678901234567890')).toEqual(true);
        expect(isValidAddress('Mc1234567890123456789012345678901234567890')).toEqual(false);
        expect(isValidAddress('Mx12345678901234567890123456789012345678901')).toEqual(false);
    });

    test('isValidCheck', () => {
        expect(isValidCheck('Mc0123')).toEqual(true);
        expect(isValidCheck('Mx0123')).toEqual(false);
        expect(isValidCheck('Mc')).toEqual(false);
    });

    test('isValidTransaction', () => {
        expect(isValidTransaction('Mt1234567890123456789012345678901234567890123456789012345678901234')).toEqual(true);
        expect(isValidTransaction('Mc1234567890123456789012345678901234567890123456789012345678901234')).toEqual(false);
        expect(isValidTransaction('Mt12345678901234567890123456789012345678901234567890123456789012345')).toEqual(false);
    });
});
