import {publicKeyCreate} from 'secp256k1';
import {privateToPublic} from 'ethereumjs-util/dist/account.js';
import * as minterUtil from '~/src';

const PRIVATE_KEY = Buffer.from('5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da', 'hex');

describe('publicToAddress()', () => {
    const validAddress = Buffer.from('7633980c000139dd3bd24a3f54e06474fa941e16', 'hex');
    test('correct public from private', () => {
        const publicKey = privateToPublic(PRIVATE_KEY);
        expect(publicKey.toString('hex')).toEqual('f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3cb8a015b8031d02e79456aedb361fa20ec1a119d6009e5c08e9d1eeb5b29ad92');
    });
    test('should work with etherium style public', () => {
        const publicKey = privateToPublic(PRIVATE_KEY);
        const address = minterUtil.publicToAddress(publicKey);
        expect(address).toEqual(validAddress);
    });
    test('should work with compressed public', () => {
        const publicKey = publicKeyCreate(PRIVATE_KEY, true);
        const address = minterUtil.publicToAddress(publicKey);
        expect(address).toEqual(validAddress);
    });
    test('should work with uncompressed public', () => {
        const publicKey = publicKeyCreate(PRIVATE_KEY, false);
        const address = minterUtil.publicToAddress(publicKey);
        expect(address).toEqual(validAddress);
    });
    test('should throw on Minter style public', () => {
        const mPublicKey = minterUtil.mToBuffer('Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3');
        expect(() => {
            minterUtil.publicToAddress(mPublicKey);
        }).toThrow();
    });
});

describe('publicToString()', () => {
    const validPublicString = 'Mpf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3';
    test('should work', () => {
        const publicKey = privateToPublic(PRIVATE_KEY);
        const publicKeyString = minterUtil.publicToString(publicKey);
        expect(publicKeyString).toHaveLength(64 + 2);
        expect(publicKeyString).toEqual(validPublicString);
    });
    test('should work with compressed public', () => {
        const publicKey = publicKeyCreate(PRIVATE_KEY, true);
        const publicKeyString = minterUtil.publicToString(publicKey);
        expect(publicKeyString).toEqual(validPublicString);
    });
    test('should work with uncompressed public', () => {
        const publicKey = publicKeyCreate(PRIVATE_KEY, false);
        const publicKeyString = minterUtil.publicToString(publicKey);
        expect(publicKeyString).toEqual(validPublicString);
    });
    test('should work on 0x string', () => {
        const publicKeyString = minterUtil.publicToString('0xf9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3');
        expect(publicKeyString).toEqual(validPublicString);
    });
    test('should throw on invalid string', () => {
        expect(() => {
            minterUtil.publicToString('f9e036839a29f7fba2d5394bd489eda927ccb95acc99e506e688e4888082b3a3');
        }).toThrow();
    });
});

describe('isValidPublic()', () => {
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
    test('should fail with wrong string prefix "mp"', () => {
        const pubKey = 'mp28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544';
        expect(minterUtil.isValidPublic(pubKey)).toBe(false);
    });
    test('should fail with wrong string prefix "0x"', () => {
        const pubKey = '0x28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544';
        expect(minterUtil.isValidPublic(pubKey)).toBe(false);
    });
});
