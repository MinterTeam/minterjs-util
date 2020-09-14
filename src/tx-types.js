import {padToEven} from 'ethjs-util';

/**
 * @enum {string}
 */
export const TX_TYPE = {
    SEND: '0x01',
    SELL: '0x02',
    SELL_ALL: '0x03',
    BUY: '0x04',
    CREATE_COIN: '0x05',
    DECLARE_CANDIDACY: '0x06',
    DELEGATE: '0x07',
    UNBOND: '0x08',
    REDEEM_CHECK: '0x09',
    SET_CANDIDATE_ON: '0x0A',
    SET_CANDIDATE_OFF: '0x0B',
    CREATE_MULTISIG: '0x0C',
    MULTISEND: '0x0D',
    EDIT_CANDIDATE: '0x0E',
    SET_HALT_BLOCK: '0x0F',
    RECREATE_COIN: '0x10',
    EDIT_COIN_OWNER: '0x11',
    EDIT_MULTISIG_OWNERS: '0x12',
    PRICE_VOTE: '0x13',
    EDIT_CANDIDATE_PUBLIC_KEY: '0x14',
};

/** @type {Array<{hex: string, name: string, number: number}>} */
const txTypeList = [];

/**
 * @param hex
 * @param name
 */
function fillList(hex, name) {
    const result = {};

    result.name = name;
    result.number = Number(hex);
    result.hex = hex;

    txTypeList[result.number] = result;

    return result;
}
fillList(TX_TYPE.SEND, 'send');
fillList(TX_TYPE.SELL, 'sell');
fillList(TX_TYPE.SELL_ALL, 'sell all');
fillList(TX_TYPE.BUY, 'buy');
fillList(TX_TYPE.CREATE_COIN, 'create coin');
fillList(TX_TYPE.DECLARE_CANDIDACY, 'declare candidacy');
fillList(TX_TYPE.DELEGATE, 'delegate');
fillList(TX_TYPE.UNBOND, 'unbond');
fillList(TX_TYPE.REDEEM_CHECK, 'redeem check');
fillList(TX_TYPE.SET_CANDIDATE_ON, 'set candidate on');
fillList(TX_TYPE.SET_CANDIDATE_OFF, 'set candidate off');
fillList(TX_TYPE.CREATE_MULTISIG, 'create multisig');
fillList(TX_TYPE.MULTISEND, 'multisend');
fillList(TX_TYPE.EDIT_CANDIDATE, 'edit candidate');
fillList(TX_TYPE.SET_HALT_BLOCK, 'set halt block');
fillList(TX_TYPE.RECREATE_COIN, 'recreate coin');
fillList(TX_TYPE.EDIT_COIN_OWNER, 'edit coin owner');
fillList(TX_TYPE.EDIT_MULTISIG_OWNERS, 'edit multisig owners');
fillList(TX_TYPE.PRICE_VOTE, 'price vote');
fillList(TX_TYPE.EDIT_CANDIDATE_PUBLIC_KEY, 'edit candidate public key');

export {txTypeList};

/**
 *
 * @param {TX_TYPE|number|string|Buffer|Uint8Array} txType
 * @return {TX_TYPE}
 */
export function normalizeTxType(txType) {
    // Buffer or Uint8Array to TX_TYPE
    if (txType.length && typeof txType !== 'string') {
        txType = Buffer.from(txType).toString('hex');
        txType = `0x${txType}`;
    }
    // invalid string to number
    if (typeof txType === 'string' && txType.indexOf('0x') !== 0 && txType.indexOf('0X') !== 0) {
        txType = parseInt(txType, 10);
    }
    // number to TX_TYPE
    if (typeof txType === 'number') {
        txType = padToEven(txType.toString(16));
        txType = `0x${txType}`;
    }

    txType = txType.toUpperCase();
    txType = txType.replace(/^0X/, '0x');

    if (!Object.values(TX_TYPE).includes(txType)) {
        throw new Error('Invalid tx type');
    }

    return txType;
}
