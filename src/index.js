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
 * Converts Minter prefixed value to Buffer
 * @param value
 * @return {Buffer}
 */
export function mToBuffer(value) {
    if (typeof value === 'string') {
        value = mPrefixToHex(value);
    }

    return ethUtil.toBuffer(value);
}

/**
 * Checks if the public key satisfies the rules of the curve secp256k1
 * and the requirements of Minter.
 * @param {string|Buffer} publicKey The two points of an uncompressed key, unless sanitize is enabled
 * @return {Boolean}
 */
export function isValidPublic(publicKey) {
    if (typeof publicKey === 'string') {
        if (publicKey.substr(0, 2) !== 'Mp') {
            return false;
        }
        publicKey = mToBuffer(publicKey);
    }

    return ethUtil.isValidPublic(publicKey);
}

export function isValidAddress(address) {
    return /^Mx[0-9a-fA-F]{40}$/.test(address);
}
