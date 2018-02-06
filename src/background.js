let cashbackDomains, domainToSpecialEbatesUrl; // Will be set on init

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

const toggleEbatesButton = () => {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, tabs => {
        const domain = getDomain(tabs[0]);
        if (cashbackDomains.has(domain) || domainToSpecialEbatesUrl.hasOwnProperty(domain)) {
            chrome.browserAction.enable();
        } else {
            chrome.browserAction.disable();
        }
    });
};

async function initPlugin() {

    // Why XHR instead of import? Node doesn't support es6 modules. There's a node script that reads
    // cashbackDomains.json to determine whether the list of ebates domain has added or removed cashback merchants
    cashbackDomains = new Set(await $.get('assets/cashbackDomains.json'));
    domainToSpecialEbatesUrl = await $.get('assets/domainRedirectMap.json');

    chrome.browserAction.disable(); // Btn disabled by default

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        toggleEbatesButton();
    });

    chrome.tabs.onActivated.addListener(function (tab) {
        toggleEbatesButton();
    });

    chrome.browserAction.onClicked.addListener(goToEbates);
}

initPlugin();
