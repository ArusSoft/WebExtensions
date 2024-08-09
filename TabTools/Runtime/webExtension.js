/** v24.08.09 */
// @ts-check
/// <reference path="./index.d.ts" />

export const getCurrentTab = async () => (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))?.[0];

export const getHighlightedTabs = () => chrome.tabs.query({ highlighted: true });
