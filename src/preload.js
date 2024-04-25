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