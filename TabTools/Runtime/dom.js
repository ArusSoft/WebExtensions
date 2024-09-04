/** v24.09.04 */
// @ts-check
/// <reference path="./index.d.ts" />

/**
 * @typedef {{url: string, title: String, hint?: String}} Link
 * @typedef {Array<Link>} Links
 */

/** @typedef {8 | 16 | 24 | 32} Size */

/**
 * Create url for bookmark favicon
 * @param {string} siteUrl 
 * @param {Size} size
 * @returns {string}
 */
export const getBookmarkIconUrl = (siteUrl, size = 16) => {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", siteUrl);
    url.searchParams.set("size", size.toString());
    return url.toString();
}

/**
 * Create button element
 * @param {string} text - button text
 * @param {() => void} onClick - on click handler
 * @returns {HTMLButtonElement}
 */
export const createButton = (text, onClick) => {
    const elBtn = document.createElement('button');
    elBtn.append(text);
    elBtn.onclick = onClick;
    return elBtn;
};

let radioGroupInc = 0;

/**
 * @template {{label: string, value: string}} Option
 * @param {Array<Option>} options 
 * @param {string} defaultValue 
 */
export const createRadioGroup = (options, defaultValue) => {
    radioGroupInc++;
    let selectedValue = defaultValue;
    const fieldsetEl = document.createElement('fieldset');
    fieldsetEl.classList.toggle('radioGroup');
    options.forEach(({ label, value }) => {
        const labelEl = document.createElement('label');
        const inputEl = document.createElement('input');
        inputEl.setAttribute('type', 'radio');
        inputEl.setAttribute('value', value);
        inputEl.setAttribute('name', 'radioGroup' + radioGroupInc);
        if(value === defaultValue)
            inputEl.setAttribute('checked', '');

        inputEl.onclick = () => {
            selectedValue = value;
        };

        labelEl.append(inputEl, label);
        fieldsetEl.append(labelEl);
    })

    return {
        element: fieldsetEl,
        getSelectedValue: () => selectedValue,
    }
}

/**
 * Create link for bookmark with favicon
 * @param {Link} link 
 * @param {Size} imgSize 
 * @returns 
 */
export const createBookmarkLink = (link, imgSize = 16) => {
    const elImg = document.createElement('img');
    elImg.src = getBookmarkIconUrl(link.url, imgSize);

    const elA = document.createElement('a');
    elA.href = link.url;
    link.hint && elA.setAttribute('title', link.hint);
    elA.innerText = link.title;

    const elWrapper = document.createElement('div');
    elWrapper.setAttribute('class', 'link');

    elWrapper.append(elImg, elA);

    return elWrapper;
};

/**
 * 
 * @param {string?} legend 
 * @returns {HTMLFieldSetElement}
 */
export const createGroup = (legend) => {
    const elFieldset = document.createElement('fieldset');

    if (legend) {
        const elLegend = document.createElement('legend');
        elLegend.innerText = legend;
        elFieldset.append(elLegend);
    }

    return elFieldset;
};

