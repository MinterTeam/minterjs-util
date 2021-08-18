/* eslint-disable unicorn/prevent-abbreviations */

import Big from 'big.js';
import BN from 'bn.js';
import {padToEven} from 'ethjs-util';

// use ROUND_HALF_EVEN to align with blockchain rounding
// Rounds towards nearest neighbour. If equidistant, rounds towards even neighbour.
Big.RM = 2;
const DECIMALS = 18;

/**
 * @param {number,string,Big} num
 * @param {'pip'|'bip'} to
 * @param {'hex'} [format]
 * @return {string}
 */
export function convert(num, to, format) {
    if (to === 'bip' && format === 'hex') {
        throw new Error('Converting from pip to hex format doesn\'t supported');
    }

    const numBig = numberToBig(num);

    const pow = new Big(10).pow(DECIMALS);

    let result;
    if (to === 'pip') {
        result = numBig.times(pow).toFixed(0);
        if (format === 'hex') {
            return padToEven(new BN(result, 10).toString(16));
        } else {
            return result;
        }
    } else if (to === 'bip') {
        // eslint-disable-next-line unicorn/require-number-to-fixed-digits-argument
        return numBig.round().div(pow).toFixed();
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
export function convertToPip(num, format) {
    return convert(num, 'pip', format);
}

/**
 * Multiply value by 10^-18
 * @param {number,string,Big} num
 * @return {string}
 */
export function convertFromPip(num) {
    return convert(num, 'bip');
}

/**
 * @param {string} str
 * @return {boolean}
 */
// function isNumericString(str) {
//     const NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
//     return NUMERIC.test(str);
// }

/**
 *
 * @param {number,string,Big} num
 * @return {Big}
 */
export function numberToBig(num) {
    // if num is prefixed hex string
    if (typeof num === 'string' && num.indexOf('0x') === 0) {
        if (num === '0x') {
            num = '0x0';
        }

        // convert prefixed hex to decimal string
        num = new BN(num.slice(2), 16).toString(10);
    }

    // `big.js` already throws on invalid numbers
    // if num is not numeric string
    // if (typeof num === 'string' && !isNumericString(num)) {
    //     throw new Error('Invalid number');
    // }

    return new Big(num);
}
