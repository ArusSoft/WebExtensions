// @ts-check
/// <reference path='../index.d.ts' />

import { createButton, createGroup } from '../Runtime/dom.js';
import { getCurrentTab } from '../Runtime/webExtension.js';

/*
    createButton("", async () => {

    }),
*/

const clipboardInbox = createGroup('Inbox');
clipboardInbox.append(
    createButton("Save to Inbox and close", async () => {
        const tab = await getCurrentTab();
        if (!(tab && tab.id && tab.url)) return;

        const { id, url, title } = tab;
        const inboxId = (await chrome.bookmarks.search({ title: 'Inbox' }))[0].id
        chrome.bookmarks.create({ parentId: inboxId, title, url });
        chrome.tabs.remove(id);
    }),
    createButton("Save to Inbox from clipboard", async () => {
        const text = await navigator.clipboard.readText();
        const urls = text.split('\n');
        const inboxId = (await chrome.bookmarks.search({ title: 'Inbox' }))[0].id

        urls.forEach(async (url) => {
            const historyItems = await chrome.history.search({ text: url });
            const title = historyItems.length ? historyItems[0].title : '';
            chrome.bookmarks.create({ parentId: inboxId, title, url });

        });
    }),
);
