'use strict';

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const impasyncVersion = require('../imapsync_binaries/version');
const child = require('child_process');
const del = require('del');

const downloadsPath = path.resolve(__dirname, 'downloads');
const currentVersion = impasyncVersion.version;
let latestVersion = null;

axios.get('https://imapsync.lamiral.info/VERSION')
    .then(({data}) => {
        latestVersion = data;

        if (currentVersion != latestVersion) {
            upgrade();
        } else {
            console.log('Already up-to-date');
        }
    })
    .catch(error => console.error(error));

function init() {
    cleanup();

    if (!fs.existsSync(downloadsPath)) {
        fs.mkdir(downloadsPath, {}, err => {
            if (err) throw err
        });
    }

}

function upgrade() {
    init();

    console.log(`Upgrade from v${currentVersion} to v${latestVersion}`);

    let sourcePath = null;
    // Download perl script
    messageDownloading('perl script');
    sourcePath = downloadBinary('imapsync');
    move(sourcePath, 'bin/imapsync');
    messageUpgraded('perl script');

    // Download darwin binary
    messageDownloading('darwin binary');
    sourcePath = downloadBinary('imapsync_bin_Darwin');
    move(sourcePath, 'darwin/imapsync');
    messageUpgraded('darwin binary');

    // Download windows binary
    messageDownloading('windows binary');
    const zipFilename = `imapsync_${latestVersion}`;
    const extractFolder = path.resolve(downloadsPath, 'imapsync_extracted/');
    sourcePath = downloadBinary(zipFilename + '.zip');
    child.execSync(`unzip -q ${sourcePath} -d ${extractFolder}`);
    move(path.resolve(extractFolder, zipFilename, 'imapsync.exe'), 'windows/imapsync.exe', false);
    messageUpgraded('windows binary');

    finalize();
}

function downloadBinary(fileName) {
    child.execSync(`cd ${downloadsPath} && curl -LO# https://imapsync.lamiral.info/dist/${fileName}`);
    return path.resolve(downloadsPath, fileName);
}

function move(source, target, setPermissions=true) {
    if (setPermissions) {
        child.execSync('chmod a+x ' + source);
    }

    fs.renameSync(
        source,
        path.resolve(__dirname, '../imapsync_binaries/', target)
    );
}

function finalize() {
    fs.writeFileSync(
        path.resolve(__dirname, '../imapsync_binaries/version.json'),
        JSON.stringify({version: latestVersion.toString()}, null, 2)
    );

    cleanup();
}

function cleanup() {
    del.sync([downloadsPath]);
}

function messageDownloading(binName) {
    console.log(`Downloading ${binName}...`);
}

function messageUpgraded(binName) {
    console.log(`Successfully upgraded ${binName}!`);
}