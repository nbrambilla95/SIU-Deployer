const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('consoleApi', {
    receive: (channel, func) => {
        if (channel === 'console-output') {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
});