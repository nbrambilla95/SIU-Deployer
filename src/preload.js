const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    openConsoleWindow: (scriptPath) => {
        ipcRenderer.send('open-console', scriptPath);
    },
    onScriptExitStatus: (callback) => {
        ipcRenderer.on('script-exit-status', (event, success) => {
            callback(success);
        });
    }
});

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => {
      switch (channel) {
        case 'save-database':
          ipcRenderer.send(channel, data);
          break;
        case 'upload-database-config':
          ipcRenderer.send(channel, data);
          break;
        default:
          console.error(`Invalid channel: ${channel}`);
      }
    }
});