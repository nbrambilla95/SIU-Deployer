const { app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron');
const path = require('node:path');
const { exec } = require('child_process');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: false,
      enableRemoteModule: false
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.webContents.once('did-finish-load', () => {
    ipcMain.on('deploy-clicked', () => {
      mainWindow.webContents.send('toggle-deploy-options', true);
    });
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('open-console', (event, scriptPath) => {
  const consoleWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'consolePreload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  consoleWindow.loadFile(path.join(__dirname, 'console.html'));

  consoleWindow.webContents.once('did-finish-load', () => {
    // Ejecuta el script y envía la salida a la ventana de consola
    exec(scriptPath, (error, stdout, stderr) => {
      if (error) {
        consoleWindow.webContents.send('console-output', `Error: ${error.message}`);
        return;
      }
      if (stderr) {
        consoleWindow.webContents.send('console-output', `stderr: ${stderr}`);
        return;
      }
      consoleWindow.webContents.send('console-output', stdout);
    });
  });
});