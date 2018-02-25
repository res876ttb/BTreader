// main.js
'use strict';

const electron = require('electron');
const {dialog, ipcMain, Menu, MenuItem} = require('electron');
const windowStateKeeper = require('electron-window-state');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
	var mainWindowState = windowStateKeeper({
		defaultWidth: 800,
		defaultHeight: 600
	});

	mainWindow = new BrowserWindow({
		x: mainWindowState.x,
		y: mainWindowState.y,
		height: mainWindowState.height,
		width: mainWindowState.width,
		minWidth: 600,
		minHeight: 450,
	});

	mainWindowState.manage(mainWindow); // let windowStateKeeper listen to the window state and save it when it change

	mainWindow.loadURL('file://' + __dirname + '/index.html');

	// developer tools
	mainWindow.webContents.openDevTools();

	mainWindow.on('close', function (e) {
		mainWindow.webContents.send('saveCurrentBook');
	});

	mainWindow.on('closed', function(e) {
		mainWindow = null;
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
	app.quit();
});

app.on('activate', function () {
	// for macOS. When all windows of this app is closed but the app is not quit, this function can recreate the app window.
	if (mainWindow === null) {
		createWindow();
	}
});

ipcMain.on('synchronous-message', (event, arg) => {
	var retVal;
	switch(arg[0]) {
		case 'getDataPath':
			console.log('Get user data path');
			event.returnValue = app.getPath('userData');
			break;
		case 'openTXT':
			console.log('Add new local novel.');
			retVal = dialog.showOpenDialog({
				filters: [
					{name: 'Text file', extensions: ['txt']}
				],
				properties: ['openFile', 'multiSelections']
			});
			event.returnValue = retVal === undefined ? [] : retVal;
			break;
		case 'readingDebug':
			console.log(arg[1]);
			event.returnValue = null;
			break;
		default:
			console.error('Main process received unexpected messages:', arg);
	}
});
