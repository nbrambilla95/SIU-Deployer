const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    openConsoleWindow: (scriptPath) => {
        ipcRenderer.send('open-console', scriptPath);
    }
});

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => {
      // Whitelist channels
      //let validChannels = ['save-database','upload-database-config']; // Add more channels as needed

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