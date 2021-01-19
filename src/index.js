const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');
let game;
app.on('ready', () => {
  game = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
    height: 580,
    width: 800,
    title: 'Game',
    frame: false
  });
  game.loadURL(path.join(__dirname, '/titleScreen/titleScreen.html'));
})