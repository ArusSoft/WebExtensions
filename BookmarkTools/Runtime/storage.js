/** v24.08.09 */
// @ts-check
/// <reference path="./index.d.ts" />

export const storage = {
    /**
     * @param {string} key 
     * @returns {Promise<string>}
     */
    get: async (key) => (await chrome.storage.local.get(key))[key],
    /**
     * @param {string} key 
     * @param {string} value 
     */
    set: async (key, value) => await chrome.storage.local.set({[key]: value}),
}
