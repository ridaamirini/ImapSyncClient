import is from 'electron-is';
import fs from 'fs';
import path from 'path';
import {execFile} from 'child_process';
import {remote} from 'electron';

// Childprocess id
let childProcess = null;
const pidFilePath = path.join(remote.app.getPath('temp'), '/imapsync.pid');

// Imapsync command options
const commandOptions = [
    '--nolog',
    '--noreleasecheck',
    '--pidfile=' + pidFilePath,
    '--pidfilelocking'
];

function getExecutablePath() {
    let binaryPath = null;

    if (is.windows()) {
        binaryPath = 'windows/imapsync.exe';
    }
    else if (is.macOS()) {
        binaryPath = 'darwin/imapsync';
    }
    else if (is.linux()) {
        binaryPath = 'bin/imapsync';
    }

    return path.join(__static, 'imapsync_binaries/', binaryPath);
}

function mapImapsyncCommandArgs(mailbox) {
    return [
        '--host1=' + mailbox.imap_from,
        '--user1=' + mailbox.mailbox_from,
        '--password1=' + mailbox.password_from,
        '--host2=' + mailbox.imap_to,
        '--user2=' + mailbox.mailbox_to,
        '--password2=' + mailbox.password_to
    ];
}

function imapsync(mailbox) {
    return new Promise((resolve, reject) => {
        let messages = {
            success: null,
            failure: null
        };

        childProcess = execFile(
            getExecutablePath(),
            [...mapImapsyncCommandArgs(mailbox), ...commandOptions],
            {encoding: 'utf8'},
            (error, stdout, stderr) => {
                messages.success = stdout;
                messages.failure = error || stderr;
            }
        );

        childProcess.on('close', code => {
            if (code !== 0 && messages.failure) {
                reject(messages.failure);
            }

            resolve(messages.success);
        });
    });
}

function abortImapsync() {
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
