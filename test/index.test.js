import {Buffer} from 'safe-buffer';
import * as minterUtil from '../src/index';

describe('isValidPublic', () => {
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
    test('should work otherwise', () => {
        let pubKey = '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d';
        pubKey = Buffer.from(pubKey, 'hex');
        expect(minterUtil.isValidPublic(pubKey)).toBe(true);
    });
    // minter tests
    test('should work with minter public', () => {
        let pubKey = 'f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3cb8a015b8031d02e79456aedb361fa20ec1a119d6009e5c08e9d1eeb5b29ad92';
        pubKey = Buffer.from(pubKey, 'hex');
        expect(minterUtil.isValidPublic(pubKey)).toBe(true);
    });
    test('should work with minter string public', () => {
        const pubKey = 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3cb8a015b8031d02e79456aedb361fa20ec1a119d6009e5c08e9d1eeb5b29ad92';
        expect(minterUtil.isValidPublic(pubKey)).toBe(true);
    });
    test('should fail with wrong string prefix', () => {
        const pubKey = '0xf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3cb8a015b8031d02e79456aedb361fa20ec1a119d6009e5c08e9d1eeb5b29ad92';
        expect(minterUtil.isValidPublic(pubKey)).toBe(false);
    });
});

describe('.isValidAddress()', () => {
    test('should return true', () => {
        expect(minterUtil.isValidAddress('Mx2f015c60e0be116b1f0cd534704db9c92118fb6a')).toBe(true);
        expect(minterUtil.isValidAddress('Mx52908400098527886E0F7030069857D2E4169EE7')).toBe(true);
    });
    test('should return false', () => {
        expect(minterUtil.isValidAddress('2f015c60e0be116b1f0cd534704db9c92118fb6a')).toBe(false);
        expect(minterUtil.isValidAddress('Mx2f015c60e0be116b1f0cd534704db9c92118fb6')).toBe(false);
        expect(minterUtil.isValidAddress('Mx2f015c60e0be116b1f0cd534704db9c92118fb6aa')).toBe(false);
        expect(minterUtil.isValidAddress('MX52908400098527886E0F7030069857D2E4169EE7')).toBe(false);
        expect(minterUtil.isValidAddress('x2f015c60e0be116b1f0cd534704db9c92118fb6a')).toBe(false);
        expect(minterUtil.isValidAddress('0x52908400098527886E0F7030069857D2E4169EE7')).toBe(false);
    });
});
