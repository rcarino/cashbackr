const fs = require('fs');
const {promisify} = require('util');
const pReadFile = promisify(fs.readFile); // Allows script to expect errors and not barf if a file is not found

async function readJson(url, defaultVal=null) {
    try {
        return JSON.parse(await pReadFile(url, 'utf8'));
    } catch(e) {
        return defaultVal; // file not found
    }
}

exports.readJson = readJson;
exports.writeJson = (url, obj) => fs.writeFile(url, JSON.stringify(obj, null, '  '), 'utf8');
