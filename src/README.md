## High Level

Standard chrome extension architecture. The extension button is specified in background.html and 
manifest.json.

Third party libs, pictures, and hard-coded cashback eligible domains are in /assets.

../scripts/updateCashbackDomains.js pulls from ebates and writes to src/assets whenever it's run and
detects changes.
