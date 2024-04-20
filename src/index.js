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
  console.log('Electron version:', process.versions.electron);
  console.log('Chromium version:', process.versions.chrome);
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
  fs.writeFile('/home/santiago/Documents/Tesis/SIU-Deployer/database-config.json', jsonData, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        event.reply('save-to-file-reply', { success: false, error: err.message });
      } else {
        console.log('Data saved to file successfully.');
        event.reply('save-to-file-reply', { success: true });
      }
  });
});

// Listener de la funcion 'upload-database-config'.
ipcMain.on('upload-database-config', (event, data) => {
  var scriptFileName = "";
  switch (data){
    case 'autogestion':
      console.log('Inside the upload of Autogestion.');
      scriptFileName = "autogestion-deploy.sh";
      break;
    case 'deploy':
      console.log('Inside the upload of Deploy.');
      break;
    default:
      console.error(`Invalid channel: ${channel}`);
  }
  // Read database configuration from JSON file
  const databaseConfig = JSON.parse(fs.readFileSync('database-config.json', 'utf8'));
  const scriptPath = path.join("/home/santiago/Documents/Tesis/SIU-Deployer/scripts/bash", scriptFileName);
  let bashScriptContent = fs.readFileSync(scriptPath, 'utf8');

  // Replace placeholders with actual database configuration
  bashScriptContent = bashScriptContent.replace(/HOST-INPUT/g, databaseConfig.host);
  bashScriptContent = bashScriptContent.replace(/DBNAME-INPUT/g, databaseConfig.dbname);
  bashScriptContent = bashScriptContent.replace(/SCHEME-INPUT/g, databaseConfig.scheme);
  bashScriptContent = bashScriptContent.replace(/PORT-INPUT/g, databaseConfig.port);
  bashScriptContent = bashScriptContent.replace(/DBUSERNAME/g, databaseConfig.dbusername);
  bashScriptContent = bashScriptContent.replace(/DBPASSWORD/g, databaseConfig.dbpassword);

  // Write modified Bash script back to file
  fs.writeFileSync(scriptPath, bashScriptContent, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      event.reply('save-to-file-reply', { success: false, error: err.message });
    } else {
      console.log('Data saved to file successfully.');
      event.reply('save-to-file-reply', { success: true });
    }
  });

  console.log(`Bash script '${scriptFileName}' modified successfully.`);
});