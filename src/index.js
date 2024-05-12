const { app, BrowserWindow, ipcMain, dialog, Notification } = require('electron');
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
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.webContents.openDevTools();
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
      if (code === 0) {
        event.sender.send('script-exit-status', true);
        new Notification({
          title: 'Pre-Requisites Check',
          body: 'All pre-requisites are installed successfully.',
        }).show();
      } else {
        event.sender.send('script-exit-status', false);
        dialog.showErrorBox('Pre-Requisites Check Failed', `Failed to execute prerequisites script successfully with exit code ${code}.`);
      }
    });

  });
});

// Listener de la funcion 'save-database'.
ipcMain.on('save-database', (event, data) => {
  // Convertir data a un JSON string
  const jsonData = JSON.stringify(data, null, 2); // Con null y 2 genera el formato pretty

  // Get the parent directory of the current directory (__dirname)
  const parentDir = path.join(__dirname, '..');

  // Escribir dato a un archivo
  fs.writeFile(parentDir + '/database-config.json', jsonData, (err) => {
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
  // Read database configuration from JSON file
  const databaseConfig = JSON.parse(fs.readFileSync('database-config.json', 'utf8'));
  var scriptFileName = "";
  switch (data){
    case 'autogestion':
      console.log('Inside the upload of Autogestion.');
      scriptFileName = "autogestion-deploy.sh";
      writeToAutogestion(scriptFileName,databaseConfig,event);
      break;
    case 'preinscripcion':
      console.log('Inside the upload of Preinscripcion.');
      scriptFileName = "autogestion-deploy.sh";
      writeToPreinscripcion(scriptFileName,databaseConfig,event);
      break;
    default:
      console.error(`Invalid channel: ${channel}`);
  }
});

function writeToAutogestion(name,data,event) {
  // Get the parent directory of the current directory (__dirname)
  const parentDir = path.join(__dirname, '..');
  const scriptPath = path.join(parentDir + "/scripts/bash", name);
  let bashScriptContent = fs.readFileSync(scriptPath, 'utf8');

  // Replace placeholders with actual database configuration
  bashScriptContent = bashScriptContent.replace(/(DBNAME|SCHEMA|HOST|PORT|PDO_USER|PDO_PASSWD)="?([^"\s]*)"?/g, (match, key, value) => {
    console.log('Inside the replacer with Match:' + match +', Key: ' + key + ', Value: ' + value + '.');
    if (key === 'DBNAME') {
      return `DBNAME="${data.dbname}"`;
    } else if (key === 'SCHEMA') {
      return `SCHEMA="${data.scheme}"`;
    } else if (key === 'HOST') {
      return `HOST="${data.host}"`;
    } else if (key === 'PORT') {
      return `PORT=${data.port}`;
    } else if (key === 'PDO_USER') {
      return `PDO_USER="${data.dbusername}"`;
    } else if (key === 'PDO_PASSWD') {
      return `PDO_PASSWD="${data.dbpassword}"`;
    }
    // Return the original match if the key is not recognized
    return match;
  });

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

  console.log(`Bash script '${name}' modified successfully.`);
};

function writeToPreinscripcion(name,data,event) {
  // Get the parent directory of the current directory (__dirname)
  const parentDir = path.join(__dirname, '..');
  const scriptPath = path.join(parentDir + "/scripts/bash", name);
  let bashScriptContent = fs.readFileSync(scriptPath, 'utf8');

  // Replace placeholders with actual database configuration
  bashScriptContent = bashScriptContent.replace(/(DBNAME_PREINSCRIPCION|DBNAME_GUARANI|HOST|PORT|PDO_USER|PDO_PASSWD)="?([^"\s]*)"?/g, (match, key, value) => {
    console.log('Inside the replacer with Match:' + match +', Key: ' + key + ', Value: ' + value + '.');
    if (key === 'DBNAME_PREINSCRIPCION') {
      return `DBNAME_PREINSCRIPCION="${data.dbnamepre}"`;
    } else if (key === 'DBNAME_GUARANI') {
      return `DBNAME_GUARANI="${data.dbnamegua}"`;
    } else if (key === 'HOST') {
      return `HOST="${data.host}"`;
    } else if (key === 'PORT') {
      return `PORT=${data.port}`;
    } else if (key === 'PDO_USER') {
      return `PDO_USER="${data.dbusername}"`;
    } else if (key === 'PDO_PASSWD') {
      return `PDO_PASSWD="${data.dbpassword}"`;
    }
    // Return the original match if the key is not recognized
    return match;
  });

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

  console.log(`Bash script '${name}' modified successfully.`);
};