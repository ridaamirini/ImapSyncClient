import is from 'electron-is';
import fs from 'fs';
import path from 'path';
import shell from 'shelljs';
import { remote } from 'electron';

// Childprocess id
let process = null;
const pidFilePath = path.join(remote.app.getPath('temp'), '/imapsync.pid');

// Imapsync command options
const commandOptions = [
  '--nolog',
  '--pidfile ' + pidFilePath,
  '--pidfilelocking'
];

function getExecutablePath () {
  if (is.windows()) {
    return path.join(__static, '/Windows/imapsync/imapsync.exe');
  }
  else if (is.macOS()) {
    return path.join(__static, '/bin/imapsync_bin_Darwin');
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

    const nodejs = shell.which('nodejs');
    const node = shell.which('node');
    shell.config.execPath = nodejs ? nodejs.stdout : (node ? node.stdout : reject(
      new Error('Node.js was not found in the default path. Please specify the location.')
    ));

    process = shell.exec(cmd, function (code, stdout, stderr) {
      if (code !== 0 && stderr) {
        reject(stderr || stdout);
      }

      resolve({code, stdout});
    });
  });
}

function abortImapsync () {
  process.kill('SIGINT');

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
