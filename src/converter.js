import {BigNumber} from 'bignumber.js';

const DECIMALS = 18;


/**
 * @param {number,string,BigNumber} num
 * @param {'pip'|'bip'} to
 * @param {'hex'} [format]
 * @return {string}
 */
function convert(num, to, format) {
    if (num === '0x') {
        num = '0x0';
    }

    const pow = new BigNumber(10).pow(DECIMALS);

    let result;
    if (to === 'pip') {
        result = new BigNumber(num).multipliedBy(pow).integerValue();
    } else if (to === 'bip') {
        result = new BigNumber(num).dividedBy(pow);
    } else {
        throw String('Unknown type');
    }

    if (format === 'hex') {
        return result.toString(16);
    } else {
        return result.toString();
    }
}

/**
 * Multiply value by 10^18
 * @param {number,string,BigNumber} num
 * @param {'hex'} [format]
 * @return {string}
 */
function convertToPip(num, format) {
    return convert(num, 'pip', format);
}

/**
 * Multiply value by 10^-18
 * @param {number,string,BigNumber} num
 * @param {'hex'} [format]
 * @return {string}
 */
function convertFromPip(num, format) {
    return convert(num, 'bip', format);
}

export default {
    convert,
    bipToPip: convertToPip,
    pipToBip: convertFromPip,
};

export {convert, convertToPip, convertFromPip};
