window.addEventListener('DOMContentLoaded', () => {
    const mainButtons = document.getElementById('container');
    const deployOptions = document.getElementById('deploy-options');
    const dbOptButton = document.getElementById('database-options');
    const dbHostInput = document.getElementById('host');
    const dbNameInput = document.getElementById('dbname');
    const dbSchemeInput = document.getElementById('scheme');
    const dbPortInput = document.getElementById('port');
    const dbUsernameInput = document.getElementById('dbusername');
    const dbPasswordInput = document.getElementById('dbpassword');
  
    document.getElementById('database').addEventListener('click', () => {
        console.log('Dentro de database');
        mainButtons.style.display = 'none';
        dbOptButton.style.display = 'flex';
    });

    // handler para la accion de "save"
    document.getElementById('save-db').addEventListener('click', () => {
        
        console.log('Dentro de save-db');

        const host = dbHostInput.value;
        const dbname = dbNameInput.value;
        const scheme = dbSchemeInput.value;
        const port = dbPortInput.value;
        const dbusername = dbUsernameInput.value;
        const dbpassword = dbPasswordInput.value;
        
        // Enviar valores al main process.
        ipcRenderer.send('save-database', { host, dbname, scheme, port, dbusername, dbpassword });
    });

    document.getElementById('back-db').addEventListener('click', () => {
        mainButtons.style.display = 'flex';
        dbOptButton.style.display = 'none';
    });

    document.getElementById('deploy').addEventListener('click', () => {
        mainButtons.style.display = 'none';
        deployOptions.style.display = 'flex';
    });

    document.getElementById('back-deploy').addEventListener('click', () => {
        mainButtons.style.display = 'flex';
        deployOptions.style.display = 'none';
    });

    document.getElementById('gestion').addEventListener('click', () => {
        window.api.openConsoleWindow('./scripts/bash/hello-world.sh');
    });

    document.getElementById('autogestion').addEventListener('click', () => {
        ipcRenderer.send('upload-database-config','autogestion');
    });
});