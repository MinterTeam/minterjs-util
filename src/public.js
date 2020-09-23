import {publicKeyConvert, publicKeyVerify} from 'secp256k1';
import {keccak256 as keccak} from 'ethereum-cryptography/keccak';
import assert from 'assert';
import { isValidPublicKeyString, mToBuffer, toBuffer } from './prefix.js';

/**
 * Returns the ethereum address of a given public key.
 * Accepts "Ethereum public keys" and SEC1 encoded keys.
 * @param {Buffer|Uint8Array} publicKey
 * @return {Buffer}
 */
export function publicToAddress(publicKey) {
    publicKey = toBuffer(publicKey);
    if (publicKey.length === 32) {
        throw new Error('Mp... public can\'t be converted to address because first byte is dropped');
    }
    if (publicKey.length === 33) {
        // compressed to uncompressed
        publicKey = Buffer.from(publicKeyConvert(publicKey, false)).slice(1);
    }
    if (publicKey.length === 65) {
        // uncompressed to Ethereum
        publicKey = publicKey.slice(1);
    }
    assert(publicKey.length === 64);
    // Only take the lower 160bits of the hash
    return keccak(publicKey).slice(-20);
}

/**
 * Return Minter style public key string
 * @param {Buffer|Uint8Array|string} publicKey
 * @return {string}
 */
export function publicToString(publicKey) {
    publicKey = toBuffer(publicKey);
    if (!Buffer.isBuffer(publicKey)) {
        throw new TypeError('Public key should be of type Buffer');
    }
    if (publicKey.length === 64) {
        // Ethereum style to uncompressed
        publicKey = Buffer.concat([Buffer.from([4]), publicKey]);
    }
    if (publicKey.length === 65) {
        // uncompressed to compressed
        publicKey = Buffer.from(publicKeyConvert(publicKey, true));
    }
    if (publicKey.length === 33) {
        publicKey = publicKey.slice(1);
    }

    assert(publicKey.length === 32);

    return `Mp${publicKey.toString('hex')}`;
}

/**
 * Checks if the public key satisfies the rules of the curve secp256k1
 * and the requirements of Minter.
 * @param {string|Buffer} publicKey - Compressed key without first byte, starts with `Mp` if is string
 * @return {Boolean}
 */
export function isValidPublic(publicKey) {
    if (typeof publicKey === 'string') {
        if (!isValidPublicKeyString(publicKey)) {
            return false;
        }
        publicKey = mToBuffer(publicKey);
    }
    if (publicKey.length !== 32) {
        return false;
    }
    // convert Minter to compressed: add first byte
    const compressed = Buffer.concat([Buffer.from([3]), publicKey]);

    return publicKeyVerify(compressed);
}
