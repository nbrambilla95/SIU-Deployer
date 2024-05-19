window.addEventListener('DOMContentLoaded', () => {
    const mainButtons = document.getElementById('container');
    const deployOptions = document.getElementById('deploy-options');

    // Database section
    const dbOptButton = document.getElementById('database-options');
    const dbHostInput = document.getElementById('host');
    const dbNameInput = document.getElementById('dbname');
    const dbSchemeInput = document.getElementById('scheme');
    const dbPortInput = document.getElementById('port');
    const dbUsernameInput = document.getElementById('dbusername');
    const dbPasswordInput = document.getElementById('dbpassword');
    
    // Settings section
    const settingsOptions = document.getElementById('settings-options');
    const settingsUrl = document.getElementById('repo_url');
    const settingsUsername = document.getElementById('repo_username');
    const settingsPassword = document.getElementById('repo_password');

    // Prerequisites section
    const preRequisitesButton = document.getElementById('check-pre-requisites');
    
    // Bloquear inicialmente todos los botones excepto el de prerrequisitos
    mainButtons.querySelectorAll('button').forEach(btn => btn.disabled = true);

    window.api.onScriptExitStatus((success) => {
        if (success)
            mainButtons.querySelectorAll('button').forEach(btn => btn.disabled = false);
        // Siempre reactiva el botón después de ejecutar para permitir reintento
        preRequisitesButton.disabled = false;
    });

    preRequisitesButton.addEventListener('click', () => {
        window.api.openConsoleWindow('./scripts/bash/check-pre-requisites.sh');
        preRequisitesButton.disabled = true;
    });
  
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

    document.getElementById('settings').addEventListener('click', () => {
        console.log('Dentro de Settings');
        mainButtons.style.display = 'none';
        settingsOptions.style.display = 'flex';
    });

    document.getElementById('back-set').addEventListener('click', () => {
        console.log('Presiono back dentro de Settings');
        mainButtons.style.display = 'flex';
        settingsOptions.style.display = 'none';
    });

    document.getElementById('save-set').addEventListener('click', () => {

        const repo_url = settingsUrl.value;
        const repo_username = settingsUsername.value;
        const repo_password = settingsPassword.value;
    
        // Enviar valores al main process.
        ipcRenderer.send('save-settings', { repo_url, repo_username, repo_password });
    });


});