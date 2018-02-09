const axios = require('axios');
const cheerio = require('cheerio');
const _ = require('lodash');
const pfs = require('./helpers/pfs');

/**
 * Node script that updates well known list of cashback domains if any changes are detected
 */

const ASSETS = '../src/assets';
const OLDCASHBACKDOMAINS = `${ASSETS}/cashbackDomains.json`;

async function checkForCashbackDomainChanges() {
    const oldDomains = await pfs.readJson(OLDCASHBACKDOMAINS, defaultVal=[]);

    // May bail here if we can't fetch data from ebates
    const data = (await axios.get('https://www.ebates.com/ajax/stores/sort.htm?sort=alpha&categoryid=')).data;

    const $ = cheerio.load(data);
    const newDomains = $('.name-link').map((i, el) => $(el).attr('href').slice(1)).toArray();

    if (!_.isEqual(oldDomains, newDomains)) {
        const [sOldDomains, sNewDomains] = [new Set(oldDomains), new Set(newDomains)];
        console.log('CHANGES DETECTED');

        const added = newDomains.filter(d => !sOldDomains.has(d));
        console.log(`ADDED ${added.length} DOMAINS: ${added}`);

        const removed = oldDomains.filter(d => !sNewDomains.has(d));
        console.log(`REMOVED ${removed.length} DOMAINS: ${removed}`);

        pfs.writeJson(OLDCASHBACKDOMAINS, newDomains);
    } else {
        console.log('NO CHANGES DETECTED');
    }

    await flagSpecialCases(newDomains);
}

const domainExtractorRegex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im;

// If a domain results in a 404 or redirect, the ebates merchant link may not correspond to a merchant's actual domain
async function flagSpecialCases(domains) {
    const specialCases = new Set(Object.values(await pfs.readJson(`${ASSETS}/domainRedirectMap.json`, defaulVal={})));
    for (let d of domains) {
        if (!specialCases.has(d)) {
            try {
                const resp = await axios.get(`https://${d}`, {timeout: 2000});
                const respUrl = resp.request.res.responseUrl; // Might be different if redirect involved
                if (respUrl.match(domainExtractorRegex)[1] !== d) {
                    console.error(`Original domain ${d} was redirected to ${respUrl}`)
                }
            } catch (e) {
                console.error(`FAILED TO REACH ${d} with error: ${e}`);
            }
        }
    }
}

checkForCashbackDomainChanges();
