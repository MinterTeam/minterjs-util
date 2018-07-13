import {Buffer} from 'safe-buffer';
import * as minterUtil from '../src/index';

describe('.isValidPublic()', () => {
    test('should fail on too short input', () => {
        let pubKey = '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae744';
        pubKey = Buffer.from(pubKey, 'hex');
        expect(minterUtil.isValidPublic(pubKey)).toBe(false);
    });
    test('should fail on too big input', () => {
        let pubKey = '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d00';
        pubKey = Buffer.from(pubKey, 'hex');
        expect(minterUtil.isValidPublic(pubKey)).toBe(false);
    });
    test('should fail on SEC1 key', () => {
        let pubKey = '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d';
        pubKey = Buffer.from(pubKey, 'hex');
        expect(minterUtil.isValidPublic(pubKey)).toBe(false);
    });
    test('should fail on SEC1 key with sanitize enabled', () => {
        let pubKey = '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d';
        pubKey = Buffer.from(pubKey, 'hex');
        expect(minterUtil.isValidPublic(pubKey, true)).toBe(false);
    });
    test('should fail with an invalid SEC1 public key', () => {
        let pubKey = '023a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d';
        pubKey = Buffer.from(pubKey, 'hex');
        expect(minterUtil.isValidPublic(pubKey, true)).toBe(false);
    });
    test('should fail with compressed keys with sanitize enabled', () => {
        let pubKey = '033a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a';
        pubKey = Buffer.from(pubKey, 'hex');
        expect(minterUtil.isValidPublic(pubKey, true)).toBe(false);
    });
    test('should fail with sanitize enabled', () => {
        let pubKey = '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d';
        pubKey = Buffer.from(pubKey, 'hex');
        expect(minterUtil.isValidPublic(pubKey, true)).toBe(false);
    });
    test('should fail on ethereum public', () => {
        let pubKey = '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d';
        pubKey = Buffer.from(pubKey, 'hex');
        expect(minterUtil.isValidPublic(pubKey)).toBe(false);
    });
    // minter tests
    test('should fail with minter uncompressed public', () => {
        let pubKey = 'f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3cb8a015b8031d02e79456aedb361fa20ec1a119d6009e5c08e9d1eeb5b29ad92';
        pubKey = Buffer.from(pubKey, 'hex');
        expect(minterUtil.isValidPublic(pubKey)).toBe(false);
    });
    test('should work with minter public', () => {
        let pubKey = '28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544';
        pubKey = Buffer.from(pubKey, 'hex');
        expect(minterUtil.isValidPublic(pubKey)).toBe(true);
    });
    test('should work with minter string public', () => {
        const pubKey = 'Mp28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544';
        expect(minterUtil.isValidPublic(pubKey)).toBe(true);
    });
    test('should work with minter string public 2', () => {
        const pubKey = 'Mp21e1d043c6d9c0bb0929ab8d1dd9f3948de0f5ad7234ce773a501441d204aa9e';
        expect(minterUtil.isValidPublic(pubKey)).toBe(true);
    });
    test('should fail with wrong string prefix', () => {
        const pubKey = 'mp28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544';
        expect(minterUtil.isValidPublic(pubKey)).toBe(false);
    });
    test('should fail with wrong string prefix', () => {
        const pubKey = '0x28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544';
        expect(minterUtil.isValidPublic(pubKey)).toBe(false);
    });
});

describe('.isValidAddress()', () => {
    test('should work with address', () => {
        expect(minterUtil.isValidAddress('Mx2f015c60e0be116b1f0cd534704db9c92118fb6a')).toBe(true);
        expect(minterUtil.isValidAddress('Mx52908400098527886E0F7030069857D2E4169EE7')).toBe(true);
    });
    test('should fail on invalid input', () => {
        expect(minterUtil.isValidAddress('2f015c60e0be116b1f0cd534704db9c92118fb6a')).toBe(false);
        expect(minterUtil.isValidAddress('Mx2f015c60e0be116b1f0cd534704db9c92118fb6')).toBe(false);
        expect(minterUtil.isValidAddress('Mx2f015c60e0be116b1f0cd534704db9c92118fb6aa')).toBe(false);
        expect(minterUtil.isValidAddress('MX52908400098527886E0F7030069857D2E4169EE7')).toBe(false);
        expect(minterUtil.isValidAddress('x2f015c60e0be116b1f0cd534704db9c92118fb6a')).toBe(false);
        expect(minterUtil.isValidAddress('0x52908400098527886E0F7030069857D2E4169EE7')).toBe(false);
    });
});

describe('.isValidCheck()', () => {
    test('should work with check', () => {
        expect(minterUtil.isValidCheck('Mc2f015c60e0be116b1f0cd534704db9c92118fb6a')).toBe(true);
        expect(minterUtil.isValidCheck('Mc52908400098527886E0F7030069857D2E4169EE7')).toBe(true);
    });
    test('should fail on invalid input', () => {
        expect(minterUtil.isValidCheck('2f015c60e0be116b1f0cd534704db9c92118fb6a')).toBe(false);
        expect(minterUtil.isValidCheck('Mc2f015c60e0be116b1f0cd534704db9c92118fb6')).toBe(false);
        expect(minterUtil.isValidCheck('Mc2f015c60e0be116b1f0cd534704db9c92118fb6aa')).toBe(false);
        expect(minterUtil.isValidCheck('MC52908400098527886E0F7030069857D2E4169EE7')).toBe(false);
        expect(minterUtil.isValidCheck('x2f015c60e0be116b1f0cd534704db9c92118fb6a')).toBe(false);
        expect(minterUtil.isValidCheck('0x52908400098527886E0F7030069857D2E4169EE7')).toBe(false);
    });
});

describe('.isValidPublicKeyString()', () => {
    test('should work with public key', () => {
        expect(minterUtil.isValidPublicKeyString('Mp28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544')).toBe(true);
        expect(minterUtil.isValidPublicKeyString('Mp0000000000000000000000000000000000000000000000000000000000000000')).toBe(true);
    });
    test('should fail on invalid input', () => {
        expect(minterUtil.isValidPublicKeyString('28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544')).toBe(false);
        expect(minterUtil.isValidPublicKeyString('Mp28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f41054')).toBe(false);
        expect(minterUtil.isValidPublicKeyString('Mp28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f4105440')).toBe(false);
        expect(minterUtil.isValidPublicKeyString('MP28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544')).toBe(false);
        expect(minterUtil.isValidPublicKeyString('0x28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544')).toBe(false);
    });
});

describe('.isMinterPrefixed()', () => {
    test('should work with minter prefix', () => {
        expect(minterUtil.isMinterPrefixed('Mp28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544')).toBe(true);
        expect(minterUtil.isMinterPrefixed('Mc52908400098527886E0F7030069857D2E4169EE7')).toBe(true);
        expect(minterUtil.isMinterPrefixed('Mx7633980c000139dd3bd24a3f54e06474fa941e16')).toBe(true);
        expect(minterUtil.isMinterPrefixed('Mh4eacb2e4bcc0514d5526895f4f699acf543081d2')).toBe(true);
        expect(minterUtil.isMinterPrefixed('Mtc56ed8f53fa370b33b2b36764171d10a2259d807')).toBe(true);
    });
    test('should fail on invalid input', () => {
        expect(minterUtil.isMinterPrefixed('28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544')).toBe(false);
        expect(minterUtil.isMinterPrefixed('Mpxx')).toBe(false);
        expect(minterUtil.isMinterPrefixed('MP28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544')).toBe(false);
        expect(minterUtil.isMinterPrefixed('0x28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544')).toBe(false);
    });
});

describe('.mToBuffer()', () => {
    test('should work with address', () => {
        const address = minterUtil.mToBuffer('Mx7633980c000139dd3bd24a3f54e06474fa941e16');
        const buf = Buffer.from('7633980c000139dd3bd24a3f54e06474fa941e16', 'hex');
        expect(address).toEqual(buf);
    });
});

describe('.toBuffer()', () => {
    test('should work with null', () => {
        const address = minterUtil.toBuffer(null).toString('hex');
        const buf = new Buffer([]).toString('hex');
        expect(address).toEqual(buf);
    });
});
