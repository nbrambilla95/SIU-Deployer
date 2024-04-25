const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('consoleApi', {

    onOutput: (callback) => {
        ipcRenderer.on('console-output', (event, output) => callback(output));
    }
});