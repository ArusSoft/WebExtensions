/** v24.09.03 */
// @ts-check
/// <reference path="./index.d.ts" />

export const urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;


export const getUrlsFromString = (/** @type{string} */ text) => {
    const result = text.matchAll(urlRegex);

    return [...result].map(url => url[0]);
}

export const stringToUrl = (/** @type {string} */ urlString) => {
    try {
        return new URL(urlString);
    }
    catch (e) {
        return null;
    }
}