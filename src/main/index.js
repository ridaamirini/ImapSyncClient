'use strict';

import { app, BrowserWindow, ipcMain } from 'electron';
import { checkForUpdates } from './updater';

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
      title: app.getName(),
      height: 680,
      width: 1050,
      useContentSize: true,
      resizable: false,
      fullscreen: false,
      backgroundColor: '#272d33',
      show: false
    };

  if (process.platform === 'darwin') {
    options = {
      title: app.getName(),
      height: 680,
      width: 1050,
      useContentSize: true,
      resizable: false,
      frame: true,
      titleBarStyle: 'hiddenInset',
      fullscreen: false,
      backgroundColor: '#272d33',
      show: false
    };
  }

  mainWindow = new BrowserWindow(options);

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
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

// app.on('ready', createWindow);

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

app.on('ready', createWindow);

ipcMain.once('check-update', checkForUpdates);
