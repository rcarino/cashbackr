## Architecture Overview

Standard chrome extension architecture. Entrypoint of the app is manifest.json, which points to
background.html.

Pictures, and hard-coded cashback eligible domains are in /assets.

../scripts/updateCashbackDomains.js pulls from ebates and writes to src/assets whenever it's run and
detects changes.
