// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');
const { exec } = require('child_process');

contextBridge.exposeInMainWorld('api', {
    send: (channel, data) => {
        let validChannels = ['deploy-clicked'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        let validChannels = ['toggle-deploy-options'];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
    // Método adicional para ejecutar scripts de shell
    runScript: (scriptPath, callback) => {
        exec(scriptPath, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            callback(stdout);
        });
    },
    openConsoleWindow: (scriptPath) => {
        ipcRenderer.send('open-console', scriptPath);
    }
});