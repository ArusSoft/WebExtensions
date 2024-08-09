/** v24.08.09 */
// @ts-check
/// <reference path="./index.d.ts" />

/**
 * @typedef {{url: string, title: String, hint?: String}} Link
 * @typedef {Array<Link>} Links
 */

/**
 * @param {string} id 
 * @param {(e: Event) => void} onClick 
 */
export const onBtnClick = (id, onClick) => document.getElementById(id)?.addEventListener('click', onClick);

/** @typedef {8 | 16 | 24 | 32} Size */

/**
 * @param {string} siteUrl 
 * @param {Size} size
 * @returns {string}
 */
export const faviconURL = (siteUrl, size = 16) => {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", siteUrl);
    url.searchParams.set("size", size.toString());
    return url.toString();
}

export const factory = {
    btn: (/** @type {string} */ text, /** @type {() => void} */ onClick) => {
        const elBtn = document.createElement('button');
        elBtn.append(text);
        elBtn.onclick = onClick;
        return elBtn;    
    },
    lnk: (/** @type {Link} */ link, /** @type {Size} */  imgSize = 16) => {
        const elImg = document.createElement('img');
        elImg.src = faviconURL(link.url, imgSize);

        const elA = document.createElement('a');
        elA.href = link.url;
        link.hint && elA.setAttribute('title', link.hint);
        elA.innerText = link.title;

        const elWrapper = document.createElement('div');
        elWrapper.setAttribute('class', 'link');

        elWrapper.appendChild(elImg);
        elWrapper.appendChild(elA);

        return elWrapper;
    },
}
