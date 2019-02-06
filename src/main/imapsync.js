import is from 'electron-is';
import path from 'path';
import shell from 'shelljs';

// Childprocess id
let process = null;

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
              ' --nolog ' +
              convertToCommandParams(mailbox);

    shell.config.execPath = shell.which('nodejs').stdout;
    process = shell.exec(cmd, function (code, stdout, stderr) {
      if (code !== 0 && stderr) {
        reject(stderr || stdout);
      }
      resolve({code, stdout});
    });
  });
}

function abortImapsync () {
  // @todo see #17
  console.log(process.kill('SIGINT'));
}

export {
  abortImapsync,
  imapsync
};
