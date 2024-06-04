const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  openConsoleWindow: (scriptPath) => {
    ipcRenderer.send('open-console', scriptPath);
  },
  onScriptExitStatus: (callback) => {
    ipcRenderer.on('script-exit-status', (event, success) => {
      callback(success);
    });
  },
  onSelectedPath: (callback) => {
    ipcRenderer.on('selected-path', (event, path) => {
      callback(path);
    });
  },
  onSaveToFileReply: (callback) => {
    ipcRenderer.on('save-to-file-reply', (event, result) => {
      callback(result);
    });
  },
  selectDirectory: () => {
    ipcRenderer.send('select-directory');
  },
  onSetDirectory: (callback) => {
    ipcRenderer.on('set-directory', (event, path) => {
      callback(path);
    });
  },
  setDirectory: (path) => {
    ipcRenderer.send('set-directory', path);
  }
});

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => {
    switch (channel) {
      case 'save-database':
        ipcRenderer.send(channel, data);
        break;
      case 'save-module-database':
        ipcRenderer.send(channel, data);
        break;
      case 'save-settings':
        ipcRenderer.send(channel, data);
        break;
      case 'run-script':
        ipcRenderer.send(channel, data);
        break;
      default:
        console.error(`Invalid channel: ${channel}`);
    }
  }
});