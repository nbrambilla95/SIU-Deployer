const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    openConsoleWindow: (scriptPath) => {
        ipcRenderer.send('open-console', scriptPath);
    }
});