const pfs = require('./helpers/pfs');
const archiver = require('archiver');
const fs = require('fs');

async function bumpAndBuild() {
    const manifest = await pfs.readJson('../src/manifest.json');
    const old_version = manifest.version.split('.').map(Number);
    old_version[2] = old_version[2] + 1;
    manifest.version = old_version.join('.'); // Bumped
    pfs.writeJson('../src/manifest.json', manifest);

    const output = fs.createWriteStream(`../releases/${manifest.version}.zip`);
    const archive = archiver('zip');
    archive.pipe(output);
    archive.directory('../src', false);
    archive.finalize();
    console.log('BUILT NEW VERSION : ' + manifest.version)
}

bumpAndBuild();
