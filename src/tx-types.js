import {padToEven} from 'ethjs-util';

/**
 * @enum {string} TX_TYPE
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
    EDIT_TICKER_OWNER: '0x11',
    EDIT_MULTISIG: '0x12',
    PRICE_VOTE: '0x13',
    EDIT_CANDIDATE_PUBLIC_KEY: '0x14',
    ADD_LIQUIDITY: '0x15',
    REMOVE_LIQUIDITY: '0x16',
    SELL_SWAP_POOL: '0x17',
    BUY_SWAP_POOL: '0x18',
    SELL_ALL_SWAP_POOL: '0x19',
    EDIT_CANDIDATE_COMMISSION: '0x1A',
    MOVE_STAKE: '0x1B',
    MINT_TOKEN: '0x1C',
    BURN_TOKEN: '0x1D',
    CREATE_TOKEN: '0x1E',
    RECREATE_TOKEN: '0x1F',
    VOTE_COMMISSION: '0x20',
    VOTE_UPDATE: '0x21',
    CREATE_SWAP_POOL: '0x22',
    ADD_LIMIT_ORDER: '0x23',
    REMOVE_LIMIT_ORDER: '0x24',
    LOCK_STAKE: '0x25',
    LOCK: '0x26',
};

const DISABLED_TYPES = {
    [TX_TYPE.PRICE_VOTE]: true,
};

// swap: keys <=> values
const txTypeKeys = Object.fromEntries(Object.entries(TX_TYPE).map(([key, hexValue]) => [hexValue, key]));

/**
 * @typedef {Object} TxTypeItem
 * @property {TX_TYPE} hex
 * @property {string} name
 * @property {number} number
 * @property {string} key
 * @property {boolean} isDisabled
 */

/** @type {Array<TxTypeItem>} */
const txTypeList = [];

/**
 * @param hex
 * @param [name]
 * @return {TxTypeItem}
 */
function fillList(hex, name) {
    const result = {};

    result.key = txTypeKeys[hex].toLowerCase();
    result.name = name || result.key.replace(/_/g, ' ');
    result.number = Number(hex);
    result.hex = hex;
    result.isDisabled = !!DISABLED_TYPES[hex];

    txTypeList[result.number] = result;

    return result;
}
fillList(TX_TYPE.SEND);
fillList(TX_TYPE.SELL);
fillList(TX_TYPE.SELL_ALL);
fillList(TX_TYPE.BUY);
fillList(TX_TYPE.CREATE_COIN);
fillList(TX_TYPE.DECLARE_CANDIDACY);
fillList(TX_TYPE.DELEGATE);
fillList(TX_TYPE.UNBOND);
fillList(TX_TYPE.REDEEM_CHECK);
fillList(TX_TYPE.SET_CANDIDATE_ON);
fillList(TX_TYPE.SET_CANDIDATE_OFF);
fillList(TX_TYPE.CREATE_MULTISIG);
fillList(TX_TYPE.MULTISEND);
fillList(TX_TYPE.EDIT_CANDIDATE);
fillList(TX_TYPE.SET_HALT_BLOCK, 'vote for halt block');
fillList(TX_TYPE.RECREATE_COIN);
fillList(TX_TYPE.EDIT_TICKER_OWNER);
fillList(TX_TYPE.EDIT_MULTISIG);
fillList(TX_TYPE.PRICE_VOTE, 'vote for price');
fillList(TX_TYPE.EDIT_CANDIDATE_PUBLIC_KEY);
fillList(TX_TYPE.ADD_LIQUIDITY, 'add liquidity to pool');
fillList(TX_TYPE.REMOVE_LIQUIDITY, 'remove liquidity from pool');
fillList(TX_TYPE.SELL_SWAP_POOL, 'sell within pool');
fillList(TX_TYPE.BUY_SWAP_POOL, 'buy within pool');
fillList(TX_TYPE.SELL_ALL_SWAP_POOL, 'sell all within pool');
fillList(TX_TYPE.EDIT_CANDIDATE_COMMISSION);
fillList(TX_TYPE.MOVE_STAKE);
fillList(TX_TYPE.MINT_TOKEN);
fillList(TX_TYPE.BURN_TOKEN);
fillList(TX_TYPE.CREATE_TOKEN);
fillList(TX_TYPE.RECREATE_TOKEN);
fillList(TX_TYPE.VOTE_COMMISSION, 'vote for commission price');
fillList(TX_TYPE.VOTE_UPDATE, 'vote for network update');
fillList(TX_TYPE.CREATE_SWAP_POOL);
fillList(TX_TYPE.ADD_LIMIT_ORDER);
fillList(TX_TYPE.REMOVE_LIMIT_ORDER);
fillList(TX_TYPE.LOCK_STAKE);
fillList(TX_TYPE.LOCK);

export {txTypeList};

/**
 *
 * @param {TX_TYPE|number|string|Buffer|Uint8Array} txType
 * @return {TX_TYPE}
 */
export function normalizeTxType(txType) {
    if (!txType) {
        throw new Error(`Invalid tx type: ${txType}`);
    }
    // Buffer or Uint8Array to TX_TYPE
    if (txType.length > 0 && typeof txType !== 'string') {
        txType = Buffer.from(txType).toString('hex');
        txType = `0x${txType}`;
    }
    // invalid string to number
    if (typeof txType === 'string' && txType.indexOf('0x') !== 0 && txType.indexOf('0X') !== 0) {
        txType = Number.parseInt(txType, 10);
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
