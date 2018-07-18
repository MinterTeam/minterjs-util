import assert from 'assert';
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
 * Returns the ethereum address of a given public key.
 * Accepts "Ethereum public keys" and SEC1 encoded keys.
 * @param {Buffer} publicKey
 * @return {Buffer}
 */
export function publicToAddress (publicKey) {
    publicKey = toBuffer(publicKey);
    if (publicKey.length === 32) {
        throw new Error ('Mp... public can\'t be converted to address because first byte is dropped')
    }
    if (publicKey.length === 33) {
        // compressed to uncompressed
        publicKey = secp256k1.publicKeyConvert(publicKey, false).slice(1);
    }
    if (publicKey.length === 65) {
        // uncompressed to Ethereum
        publicKey = publicKey.slice(1);
    }
    assert(publicKey.length === 64);
    // Only take the lower 160bits of the hash
    return ethUtil.keccak(publicKey).slice(-20);
}

/**
 * Return Minter style public key string
 * @param {Buffer} publicKey
 * @return {string}
 */
export function publicToString (publicKey) {
    if (!Buffer.isBuffer(publicKey)) {
        throw new Error('Public key should be of type Buffer');
    }
    if (publicKey.length === 64) {
        // Ethereum style to uncompressed
        publicKey = Buffer.concat([Buffer.from([4]), publicKey])
    }
    if (publicKey.length === 65) {
        // uncompressed to compressed
        publicKey = secp256k1.publicKeyConvert(publicKey, true);
    }

    assert(publicKey.length === 33);

    return 'Mp' + publicKey.slice(1).toString('hex');
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
    return /^Mc[0-9a-fA-F]+$/.test(check);
}
