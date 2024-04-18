const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    openConsoleWindow: (scriptPath) => {
        ipcRenderer.send('open-console', scriptPath);
    }
});

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => {
      // Whitelist channels
      let validChannels = ['save-database']; // Add more channels as needed
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    }
});