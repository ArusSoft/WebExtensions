// @ts-check
/// <reference path='../index.d.ts' />

import { onBtnClick, factory } from '../Runtime/dom.js';
import { getCurrentTab, getHighlightedTabs } from '../Runtime/webExtension.js';
import { getUrlFromString } from '../Runtime/url.js';

onBtnClick("btnCopySelectedTabs", async () => {
    const tabs = await getHighlightedTabs();
    const type = "text/plain";
    await navigator.clipboard.write([
        new ClipboardItem({ [type]: new Blob([tabs.map(({ url }) => url).join('\n')], { type }) })
    ]);
});
onBtnClick("btnOpenTabsFromClipboard", async () => {
    const text = await navigator.clipboard.readText();
    const urls = text.split('\n').filter(getUrlFromString);
    urls.forEach(url => chrome.tabs.create({ url }));
});
onBtnClick("btnDiscardAllTabs", async () => {
    const allTabs = await chrome.tabs.query({});
    allTabs.forEach(tab => !tab.discarded && chrome.tabs.discard(tab.id));
});
onBtnClick("btnDiscardSelectedTabs", async () => {
    const tabs = await getHighlightedTabs();
    tabs.forEach(tab => !tab.discarded && chrome.tabs.discard(tab.id));
});

// let options = {
//     type: 'progress',
//     title: 'Progress Notification',
//     message: 'This is a Progress Notification',
//     iconUrl: 'icon.png',
//     progress: 99
// };
// chrome.notifications.create({
//     type: 'basic',
//     title: 'Hello',
//     message: 'Notification from extension',
//     iconUrl: 'icon.png',
// });

// WORK ONLY IN CHROME (not in chromium)
// chrome.tts.speak("Hello MinskJS!");

// onBtnClick("btnScripting", async () => {
//     const tabId = (await getCurrentTab()).id;

//     if (tabId) {

//         await chrome.scripting
//             .executeScript({
//                 target: { tabId: (await getCurrentTab()).id },
//                 func: async () => {
//                     // document.body.style.backgroundColor = 'red';
//                     // console.log('test');

//                     const headers = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6, [role='heading']"))

//                     // change style
//                     // headers.forEach(node => { node.style.background = 'red' })

//                     // get tag and inner text
//                     // const text = headers.map(node => node.tagName + ' ' + node.innerText).join();

//                     const response = await chrome.runtime.sendMessage(headers.map(({ tagName, innerText }) => ({ tagName, innerText })));
//                     console.log(response);
//                 },
//             });

//         await chrome.scripting.insertCSS({ css: highlightHeaderStyle, target: { tabId } })
//         // await chrome.scripting.removeCSS({ css: highlightHeaderStyle, target: { tabId } })
//     }

// });

// chrome.runtime.onMessage.addListener(
//     (request, sender, sendResponse) => {
//         //   console.log(sender.tab ?
//         //               "from a content script:" + sender.tab.url :
//         //               "from the extension");
//         treeElm.innerHTML = request.map(node => `<li>${node.innerText}</li>`);
//         //   sendResponse('well done');
//     }
// );

// const highlightHeaderStyle = `
// h1, h2, h3, h4, h5, h6, [role='heading'] {
//     border-bottom: 1px solid red !important;
// }

// h1:before {content: 'h1';}
// h2:before {content: 'h2';}
// h3:before {content: 'h3';}
// h4:before {content: 'h4';}
// h5:before {content: 'h5';}
// h6:before {content: 'h6';}
// [role='heading']:before {content: 'header';}

// h1:before, h2:before, h3:before, h4:before, h5:before, h6:before, [role='heading']:before {
//     color: white;
//     background: red;
// }

// `;


