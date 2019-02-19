import Big from 'big.js';
import BN from 'bn.js';

const DECIMALS = 18;


/**
 * @param {number,string,Big} num
 * @param {'pip'|'bip'} to
 * @param {'hex'} [format]
 * @return {string}
 */
function convert(num, to, format) {
    if (to === 'bip' && format === 'hex') {
        throw new Error('Converting from pip to hex format doesn\'t supported');
    }

    // if num is prefixed hex string
    if (typeof num === 'string' && num.indexOf('0x') === 0) {
        if (num === '0x') {
            num = '0x0';
        }

        // convert prefixed hex to decimal string
        num = new BN(num.substr(2), 16).toString(10);
    }

    // if num is not numeric string
    if (typeof num === 'string' && !isNumericString(num)) {
        throw new Error('Invalid number');
    }


    const pow = new Big(10).pow(DECIMALS);

    let result;
    if (to === 'pip') {
        result = new Big(num).times(pow).round().toFixed();
        if (format === 'hex') {
            return new BN(result, 10).toString(16);
        } else {
            return result;
        }
    } else if (to === 'bip') {
        return new Big(num).div(pow).toFixed();
    } else {
        throw new Error('Unknown type');
    }
}

/**
 * Multiply value by 10^18
 * @param {number,string,Big} num
 * @param {'hex'} [format]
 * @return {string}
 */
function convertToPip(num, format) {
    return convert(num, 'pip', format);
}

/**
 * Multiply value by 10^-18
 * @param {number,string,Big} num
 * @return {string}
 */
function convertFromPip(num) {
    return convert(num, 'bip');
}

/**
 * @param {string} str
 * @return {boolean}
 */
function isNumericString(str) {
    const NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
    return NUMERIC.test(str);
}

export default {
    convert,
    bipToPip: convertToPip,
    pipToBip: convertFromPip,
};

export {convert, convertToPip, convertFromPip};
