const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { spawn } = require('child_process');
const fs = require('fs');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('open-console', (event, scriptPath) => {
  const consoleWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'consolePreload.js'),
      contextIsolation: true,
    },
  });

  consoleWindow.loadFile(path.join(__dirname, 'console.html'));

  consoleWindow.webContents.once('did-finish-load', () => {
    const script = spawn('/bin/bash', [scriptPath], { env: process.env });

    script.stdout.on('data', (data) => {
      consoleWindow.webContents.send('console-output', data.toString());
    });

    script.stderr.on('data', (data) => {
      consoleWindow.webContents.send('console-output', data.toString());
    });

    script.on('close', (code) => {
      consoleWindow.webContents.send('console-output', `Script finished with code ${code}`);
    });
  });
});

// Listener de la funcion 'save-database'.
ipcMain.on('save-database', (event, data) => {
  // Convertir data a un JSON string
  const jsonData = JSON.stringify(data, null, 2); // Con null y 2 genera el formato pretty

  // Escribir dato a un archivo
  fs.writeFile('/home/santiago/Documents/Tesis/SIU-Deployer/database_config.json', jsonData, (err) => {
      if (err) {
          console.error('Error writing to file:', err);
          event.reply('save-to-file-reply', { success: false, error: err.message });
      } else {
          console.log('Data saved to file successfully.');
          event.reply('save-to-file-reply', { success: true });
      }
  });
});