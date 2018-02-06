import {cashbackDomains, domainToSpecialEbatesUrl} from "./cashbackDomains.js";

const goToEbates = () => {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, tabs => {
        const domain = getDomain(tabs[0]);
        const ebatesPath = domainToSpecialEbatesUrl[domain] || domain;
        if (ebatesPath) {
            chrome.tabs.create({url: `https://www.ebates.com/${ebatesPath}`});
        }
    });
};

// well known regex courtesy of https://stackoverflow.com/a/25703406
const domainExtractorRegex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im;
const getDomain = tab => tab ? tab.url.match(domainExtractorRegex)[1] : null;

const enableBtn = () => {
    chrome.browserAction.enable();
    // chrome.browserAction.setBadgeBackgroundColor({color: 'green'});
    // chrome.browserAction.setBadgeText({text: '🤑'});
};

const disableBtn = () => {
    // chrome.browserAction.setBadgeText({text: ''});
    chrome.browserAction.disable();
};

const toggleEbatesButton = () => {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, tabs => {
        const domain = getDomain(tabs[0]);
        if (cashbackDomains.has(domain) || domainToSpecialEbatesUrl.hasOwnProperty(domain)) {
            enableBtn();
        } else {
            disableBtn();
        }
    });
};

const initPlugin = () => {
    disableBtn(); // Btn disabled by default

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        toggleEbatesButton();
    });

    chrome.tabs.onActivated.addListener(function (tab) {
        toggleEbatesButton();
    });

    chrome.browserAction.onClicked.addListener(goToEbates);
};

initPlugin();
