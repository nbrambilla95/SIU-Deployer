const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path');
const { spawn } = require('child_process');
const fs = require('fs');

const userDataPath = app.getPath('userData');
const configDir = path.join(userDataPath, 'config_files');
const configPath = path.join(configDir, 'config.json');
const scriptsDir = path.join(userDataPath, 'scripts');
const scriptsSrcDir = process.env.NODE_ENV === 'development'
  ? path.join(__dirname, 'scripts')
  : path.join(process.resourcesPath, 'scripts');

// Crear el directorio si no existe
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

// Copiar config.json y scripts si no existen
const copyFileIfNotExistsOrNewer = (src, dest) => {
  if (!fs.existsSync(dest) || fs.statSync(src).mtime > fs.statSync(dest).mtime) {
    fs.copyFileSync(src, dest);
    console.log(`File copied: ${src} to ${dest}`);
  }
};

copyFileIfNotExistsOrNewer(
  process.env.NODE_ENV === 'development'
    ? path.join(__dirname, 'config_files', 'config.json')
    : path.join(process.resourcesPath, 'config_files', 'config.json'),
  configPath
);

const copyScripts = (srcDir, destDir) => {
  fs.readdirSync(srcDir).forEach(file => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    if (fs.lstatSync(srcFile).isDirectory()) {
      if (!fs.existsSync(destFile)) {
        fs.mkdirSync(destFile, { recursive: true });
      }
      copyScripts(srcFile, destFile);
    } else {
      copyFileIfNotExistsOrNewer(srcFile, destFile);
    }
  });
};

copyScripts(scriptsSrcDir, scriptsDir);

// Leer la configuración desde el archivo JSON
let config = {};
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath));
} else {
  config = {
    selectedPath: '',
    database: {
      host: '',
      port: '',
      gestion: {
        dbname: '',
        schema: '',
        dbusername: '',
        dbpassword: ''
      },
      autogestion: {
        dbname: '',
        schema: '',
        dbusername: '',
        dbpassword: ''
      },
      preinscripcion: {
        dbname: '',
        schema: '',
        dbusername: '',
        dbpassword: ''
      },
      kolla: {
        dbname: '',
        schema: '',
        dbusername: '',
        dbpassword: ''
      }
    },
    repository: {
      url: '',
      username: '',
      password: ''
    },
    scripts: {},
    environment: {}
  };
}

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.webContents.openDevTools();
};

const createSetupWindow = () => {
  setupWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
    modal: true,
    show: false,
  });

  setupWindow.loadFile(path.join(__dirname, 'setup.html'));
  setupWindow.once('ready-to-show', () => {
    setupWindow.show();
  });

  ipcMain.on('select-directory', async (event) => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (!result.canceled) {
      const selectedPath = result.filePaths[0];
      event.sender.send('set-directory', selectedPath);
    }
  });

  ipcMain.on('set-directory', (event, selectedPath) => {
    config.selectedPath = selectedPath;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    setupWindow.close();
    createMainWindow();
  });
};

app.whenReady().then(createSetupWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createSetupWindow();
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
    const fullScriptPath = path.join(scriptsDir, scriptPath);
    const scriptEnv = Object.assign({}, process.env, { SELECTED_PATH: config.selectedPath });

    console.log(`Running script: ${fullScriptPath}`);

    const script = spawn('/bin/bash', [fullScriptPath, configPath], { env: scriptEnv });

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
      } else {
        event.sender.send('script-exit-status', false);
      }
    });
  });
});

// Listener de la función 'save-database'.
ipcMain.on('save-database', (event, data) => {
  config.database.host = data.host;
  config.database.port = data.port;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      event.reply('save-to-file-reply', { success: false, error: err.message });
    } else {
      console.log('Data saved to file successfully.');
      event.reply('save-to-file-reply', { success: true });
    }
  });
});

// Listener de la función 'save-module-database'.
ipcMain.on('save-module-database', (event, data) => {
  config.database[data.module] = {
    dbname: data.dbname,
    schema: data.schema,
    dbusername: data.dbusername,
    dbpassword: data.dbpassword
  };

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      event.reply('save-to-file-reply', { success: false, error: err.message });
    } else {
      console.log('Data saved to file successfully.');
      event.reply('save-to-file-reply', { success: true });
    }
  });
});

// Listener de la función 'save-settings'.
ipcMain.on('save-settings', (event, data) => {
  config.repository = {
    url: data.repo_url,
    username: data.repo_username,
    password: data.repo_password
  };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      event.reply('save-to-file-reply', { success: false, error: err.message });
    } else {
      console.log('Data saved to file successfully.');
      event.reply('save-to-file-reply', { success: true });
    }
  });
});

ipcMain.on('run-script', (event, data) => {
  const scriptPath = path.join(scriptsDir, data.script);
  const scriptEnv = Object.assign({}, process.env, { SELECTED_PATH: config.selectedPath });

  const script = spawn('/bin/bash', [scriptPath, config.selectedPath], { env: scriptEnv });

  script.stdout.on('data', (data) => {
    event.sender.send('console-output', data.toString());
  });

  script.stderr.on('data', (data) => {
    event.sender.send('console-output', data.toString());
  });

  script.on('close', (code) => {
    event.sender.send('script-exit-status', code === 0);
  });
});
