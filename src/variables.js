/**
 * @deprecated
 * Maximum amount of any coin
 * @type {number}
 */
export const COIN_MAX_AMOUNT = 10 ** 15;
/**
 * Coin's maximum `maxSupply` value (in BIP)
 * @type {number}
 */
export const COIN_MAX_MAX_SUPPLY = 10 ** 15;
/**
 * Coin's minimum `maxSupply` value (in BIP)
 * @type {number}
 */
export const COIN_MIN_MAX_SUPPLY = 1;

/**
 * Maximum number of signatures for multisig tx
 * @type {number}
 */
export const MULTISIG_SIGNATURE_MAX_COUNT = 32;

/**
 * Maximum number of recipients of multisend tx
 * @type {number}
 */
export const MULTISEND_RECIPIENT_MAX_COUNT = 100;

/**
 * Max length of tx payload (in bytes)
 * @type {number}
 */
export const PAYLOAD_MAX_LENGTH = 10_000;
