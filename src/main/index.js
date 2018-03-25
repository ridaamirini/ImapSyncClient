'use strict';

import { app, BrowserWindow } from 'electron';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`;

function createWindow () {
  /**
   * Initial window options
   */

  // Linux & Windows
  let options = {
    title: 'ImapSync Client',
    height: 680,
    width: 1050,
    useContentSize: true,
    resizable: false,
    fullscreen: false,
    backgroundColor: '#272d33'
  };

  if (process.platform === 'darwin') {
    options = {
      title: 'ImapSync Client',
      height: 680,
      width: 1050,
      useContentSize: true,
      resizable: false,
      frame: true,
      titleBarStyle: 'hiddenInset',
      fullscreen: false,
      backgroundColor: '#272d33'
    };
  }

  mainWindow = new BrowserWindow(options);

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // @todo Disable Zoom in/out  with mouse and pinch
  /* let webFrame = require('electron').webFrame;
  webFrame.setVisualZoomLevelLimits(1,1);
  webFrame.setLayoutZoomLevelLimits(0, 0); */
}

// Single Instance
let instanceToQuit = app.makeSingleInstance(function (commandLine, workingDirectory) {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

if (instanceToQuit) app.quit();

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
