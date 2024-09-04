/** v24.09.04 */
// @ts-check
/// <reference path="./index.d.ts" />

export const getCurrentTab = async () => (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))?.[0];

export const getHighlightedTabs = () => chrome.tabs.query({ highlighted: true });

/**
 * 
 * @param {string} title Notification title
 * @param {string} message Notification message
 * @param {string} iconUrl Notification icon url
 */
export const notify = (title, message, iconUrl) => chrome.notifications.create({
    type: 'basic',
    title,
    message,
    iconUrl,
});

/**
 * 
 * @param {number} tabId 
 * @param {() => void} func
 */
export const insertScript = (tabId, func) => chrome.scripting
    .executeScript({
        target: { tabId },
        func,
    });

/**
 * 
 * @param {string} css 
 * @param {number} tabId 
 * @returns 
 */
export const insertStyle = (css, tabId) => chrome.scripting.insertCSS({ css, target: { tabId } });
/**
 * 
 * @param {string} css 
 * @param {number} tabId 
 * @returns 
 */
export const removeStyle = (css, tabId) => chrome.scripting.removeCSS({ css, target: { tabId } });

