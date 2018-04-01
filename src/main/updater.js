import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { app, ipcMain } from 'electron';

app.once('browser-window-focus', (event, win) => {
  let __updateWin;

  // Set logger
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';

  // Configure updater
  autoUpdater.allowPrerelease = false;
  autoUpdater.autoDownload = false;

  autoUpdater.on('update-available', ({version, releaseNotes}) => {
    if (__updateWin) {
      return;
    }

    win.webContents.send('update-available', {
      version,
      releaseNotes,
      currentVersion: app.getVersion()
    });

    __updateWin = win;

    __updateWin.on('close', () => {
      __updateWin = null;
    });
  });

  autoUpdater.on('update-not-available', () => {
    if (__updateWin) return;

    win.webContents.send('update-not-available');
  });

  autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall();
  });

  autoUpdater.on('download-progress', progress => {
    if (__updateWin) {
      __updateWin.webContents.send('download-progress', progress);
    }
  });

  autoUpdater.on('error', error => {
    if (__updateWin) {
      __updateWin.webContents.send('update-error', error);
    }
  });

  ipcMain.on('download-update', () => {
    autoUpdater.downloadUpdate();
  });
});

export function checkForUpdates () {
    autoUpdater.checkForUpdates(); // @todo only on ENV
}
