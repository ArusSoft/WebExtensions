// @ts-check
/// <reference path='../index.d.ts' />

import { createButton, createGroup, createRadioGroup } from '../Runtime/dom.js';
import { getHighlightedTabs } from '../Runtime/webExtension.js';
import { getUrlsFromString } from '../Runtime/url.js';
import { escapeHtml } from '../Runtime/string.js';

/*
    createButton("", async () => {

    }),
*/

const nl = '\n';

const copyContentTypeRadioGroup = createRadioGroup([
    { label: 'Url per line', value: 'urlPerLine' },
    { label: 'Markdown', value: 'markdown' },
    { label: 'HTML', value: 'html' },
    { label: 'JSON', value: 'json' },
], 'urlPerLine');

const copySelectedRadioGroup = createRadioGroup([
    { label: 'Selected', value: 'selected' },
    { label: 'All', value: 'all' },
], 'selected');

const clipboardGroup = createGroup('Clipboard');
clipboardGroup.append(
    createButton("Open", async () => {
        const text = await navigator.clipboard.readText();
        const urls = getUrlsFromString(text);

        urls.forEach(url => chrome.tabs.create({ url }));
    }),

    createButton("Copy", async () => {
        const contentType = copyContentTypeRadioGroup.getSelectedValue();
        const onlySelected = copySelectedRadioGroup.getSelectedValue() === 'selected';
        const tabs = onlySelected ? await getHighlightedTabs() : await chrome.tabs.query({});
        const type = "text/plain";
        let content = '';

        const tabToMarkdown = (/** @type {chrome.tabs.Tab} */ { title, url }) => `[${title}](${url})`;
        const tabToHtml = (/** @type {chrome.tabs.Tab} */ { title, url }) => `<a href="${url}">${escapeHtml(title)}</a>`;
        const tabToJson = (/** @type {chrome.tabs.Tab} */ { title, url }) => `{title: '${title}', url: '${url}'}`;

        if (contentType === 'urlPerLine')
            content = tabs.map(({ url }) => url).join('\n');

        if (onlySelected)
            switch (contentType) {
                case 'markdown':
                    content = tabs.map(tabToMarkdown).join('\n');
                    break;
                case 'html':
                    content = tabs.map(tabToHtml).join('\n');
                    break;
                case 'json':
                    content = tabs.map(tabToJson).join('\n');
                    break;
            }
        else {
            const /** @type {Record<string, string>} */ groups = (await chrome.tabGroups.query({})).reduce((res, group) => {
                res[group.id] = group.title;
                return res;
            }, {});

            const result = tabs.reduce((res, tab) => {
                const group = groups[tab.groupId];

                if (group) {
                    let groupTabs = res.groups[tab.groupId];
                    if (!groupTabs) {
                        groupTabs = [];
                        res.groups[tab.groupId] = groupTabs;
                    }
                    groupTabs.push(tab);
                } else {
                    res.tabs.push(tab);
                }

                return res;
            }, {
                groups: {},
                tabs: [],
            });

            switch (contentType) {
                case 'markdown':
                    content = Object.entries(result.groups).map(([id, tabs]) => {
                        const title = groups[id];
                        const links = tabs.map(tabToMarkdown).join('\n');
                        return `## ${title}${nl}${nl}${links}${nl}`
                    }).join(nl + nl) + nl + nl + result.tabs.map(tabToMarkdown).join(nl);
                    break;
                case 'html':
                    content = Object.entries(result.groups).map(([id, tabs]) => {
                        const title = groups[id];
                        const links = tabs.map(tabToHtml).join('\n  ');
                        return `<section>${nl}  <h2>${title}</h2>${nl}  ${links}${nl}</section>`
                    }).join(nl + nl) + nl + nl + result.tabs.map(tabToHtml).join(nl);
                    break;
                case 'json':
                    content = Object.entries(result.groups).map(([id, tabs]) => {
                        const title = groups[id];
                        const links = tabs.map(tabToJson).join(',' + nl + '    ');
                        return `{${nl}  group: '${title}',${nl}  tabs: [${nl}    ${links}${nl}  ]${nl}}`;
                    }).join(',' + nl + nl) + nl + nl + result.tabs.map(tabToJson).join(',' + nl);
                    break;
            }
        }

        await navigator.clipboard.write([
            new ClipboardItem({ [type]: new Blob([content], { type }) })
        ]);
    }),

    copyContentTypeRadioGroup.element,
    copySelectedRadioGroup.element,
);

const discardGroup = createGroup('Discard');
discardGroup.append(
    createButton("Discard all tabs", async () => {
        const allTabs = await chrome.tabs.query({});
        allTabs.forEach(tab => !tab.discarded && chrome.tabs.discard(tab.id));
    }),
    createButton("Discard selected tabs", async () => {
        const tabs = await getHighlightedTabs();
        tabs.forEach(tab => !tab.discarded && chrome.tabs.discard(tab.id));
    }),
);

document.body.append(clipboardGroup, discardGroup);
