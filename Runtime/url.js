/** v24.08.09 */
// @ts-check
/// <reference path="./index.d.ts" />

export const getUrlFromString = (/** @type {string} */ urlString) => {
    try {
        return new URL(urlString);
    }
    catch (e) {
        return null;
    }
}