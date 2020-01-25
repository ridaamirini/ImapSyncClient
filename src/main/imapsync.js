import is from 'electron-is';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { remote } from 'electron';

// Childprocess id
let childProcess = null;
const pidFilePath = path.join(remote.app.getPath('temp'), '/imapsync.pid');

// Imapsync command options
const commandOptions = [
  '--nolog',
  '--pidfile ' + pidFilePath,
  '--pidfilelocking'
];

function getExecutablePath () {
  if (is.windows()) {
    return path.join(__static, '/windows/imapsync/imapsync.exe');
  }
  else if (is.macOS()) {
    return path.join(__static, '/bin/imapsync_bin_darwin');
  }
  else if (is.linux()) {
    return path.join(__static, '/bin/imapsync');
  }
}

function convertToCommandParams (mailbox) {
  let params = [
    '--host1',
    mailbox.imap_from,
    '--user1',
    mailbox.mailbox_from,
    '--password1',
    mailbox.password_from,
    '--host2',
    mailbox.imap_to,
    '--user2',
    mailbox.mailbox_to,
    '--password2',
    mailbox.password_to
  ];

  return params.join(' ');
}

function imapsync (mailbox) {
  return new Promise((resolve, reject) => {
    let executable = getExecutablePath();
    let cmd = executable +
              ' ' +
              commandOptions.join(' ') +
              ' ' +
              convertToCommandParams(mailbox);

    childProcess = exec(
        cmd,
        {encoding: 'utf8'},
        (error, stdout, stderr) => {
            const failure = error || stderr;
            if (childProcess.exitCode !== 0 && failure) {
                reject(failure);
            }

            resolve(stdout);
        }
    );
  });
}

function abortImapsync () {
  childProcess.kill('SIGINT');

  if (fs.existsSync(pidFilePath)) {
    fs.unlink(pidFilePath, error => {
      if (error) console.error(error);
    });
  }
}

export {
  abortImapsync,
  imapsync
};
