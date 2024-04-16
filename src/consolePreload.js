const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('consoleApi', {
    receive: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
});