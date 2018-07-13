import secp256k1 from 'secp256k1';
import {Buffer} from 'safe-buffer';
import ethUtil from 'ethereumjs-util';

/**
 * Replace Minter prefixes with hex prefix
 * @param {string} value
 */
export function mPrefixToHex(value) {
    return value.replace(/^(Mx|Mp|Mt|Mc|Mh)/, '0x');
}

/**
 * Strip Minter prefixes
 * @param {string} value
 */
export function mPrefixStrip(value) {
    return value.replace(/^(Mx|Mp|Mt|Mc|Mh)/, '');
}

/**
 * Converts Minter prefixed hex string to Buffer
 * @param {string} value
 * @return {Buffer}
 */
export function mToBuffer(value) {
    if (typeof value !== 'string') {
        throw new Error('Type error: string expected');
    }
    if (!isMinterPrefixed(value)) {
        throw new Error('Not minter prefixed');
    }
    value = mPrefixStrip(value);

    return Buffer.from(value, 'hex');
}

export function toBuffer(value) {
    if (typeof value === 'string' && isMinterPrefixed(value)) {
        return mToBuffer(value);
    }

    return ethUtil.toBuffer(value);
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
    // add first byte
    const compressed = Buffer.concat([Buffer.from([3]), publicKey]);

    return secp256k1.publicKeyVerify(compressed);
}

export function isMinterPrefixed(value) {
    return /^(Mx|Mp|Mt|Mc|Mh)[0-9a-fA-F]+$/.test(value);
}

/**
 * Checks only prefix, length and hex body.
 * Don't check secp256k1 curve.
 * @param {string} publicKey
 * @return {boolean}
 */
export function isValidPublicKeyString(publicKey) {
    return /^Mp[0-9a-fA-F]{64}$/.test(publicKey);
}

export function isValidAddress(address) {
    return /^Mx[0-9a-fA-F]{40}$/.test(address);
}

export function isValidCheck(check) {
    return /^Mc[0-9a-fA-F]{40}$/.test(check);
}
