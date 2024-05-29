window.addEventListener('DOMContentLoaded', () => {
    let selectedPath = '';
    let currentModule = '';

    // Recibir el path seleccionado
    window.api.onSelectedPath((path) => {
        selectedPath = path;
        console.log('Path seleccionado:', selectedPath);
    });

    const mainButtons = document.getElementById('container');
    const deployOptions = document.getElementById('deploy-options');

    // Database section
    const databaseButton = document.getElementById('database');
    const dbOptButton = document.getElementById('database-options');
    const dbHostInput = document.getElementById('host');
    const dbPortInput = document.getElementById('port');

    // Module Database Configuration section
    const moduleDbOptButton = document.getElementById('module-db-options');
    const moduleDbNameInput = document.getElementById('module-dbname');
    const moduleSchemaInput = document.getElementById('module-schema');
    const moduleDbUsernameInput = document.getElementById('module-dbusername');
    const moduleDbPasswordInput = document.getElementById('module-dbpassword');

    // Settings section
    const settingsOptions = document.getElementById('settings-options');
    const settingsUrl = document.getElementById('repo-url');
    const settingsUsername = document.getElementById('repo-username');
    const settingsPassword = document.getElementById('repo-password');

    // Prerequisites section
    const preRequisitesButton = document.getElementById('check-pre-requisites');

    // Bloquear inicialmente todos los botones excepto el de prerrequisitos
    mainButtons.querySelectorAll('button').forEach(btn => btn.disabled = true);

    window.api.onScriptExitStatus((success) => {
        if (success) {
            mainButtons.querySelectorAll('button').forEach(btn => btn.disabled = false);
            // Ocultar el botón de prerrequisitos si el script se ejecutó con éxito
            preRequisitesButton.style.display = 'none';
        } else {
            // Siempre reactiva el botón después de ejecutar para permitir reintento
            preRequisitesButton.disabled = false;
        }
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

    document.getElementById('save-db').addEventListener('click', () => {
        console.log('Presiono save dentro de Database');
        console.log('Dentro de save-db');

        const host = dbHostInput.value;
        const port = dbPortInput.value;

        // Enviar valores al main process.
        ipcRenderer.send('save-database', { host, port });
    });

    document.getElementById('back-db').addEventListener('click', () => {
        console.log('Presiono back dentro de Database');
        mainButtons.style.display = 'flex';
        dbOptButton.style.display = 'none';
    });

    document.getElementById('deploy').addEventListener('click', () => {
        console.log('Dentro de Deploy');

        mainButtons.style.display = 'none';
        deployOptions.style.display = 'flex';
    });

    document.getElementById('back-deploy').addEventListener('click', () => {
        console.log('Presiono back dentro de Deploy');
        mainButtons.style.display = 'flex';
        deployOptions.style.display = 'none';
    });

    document.getElementById('gestion').addEventListener('click', () => {
        currentModule = 'gestion';
        deployOptions.style.display = 'none';
        moduleDbOptButton.style.display = 'flex';
        // window.api.openConsoleWindow('./scripts/bash/hello-world.sh');
    });

    document.getElementById('autogestion').addEventListener('click', () => {
        currentModule = 'autogestion';
        deployOptions.style.display = 'none';
        moduleDbOptButton.style.display = 'flex';
        // ipcRenderer.send('upload-database-config','autogestion');
    });

    document.getElementById('preinscripcion').addEventListener('click', () => {
        currentModule = 'preinscripcion';
        deployOptions.style.display = 'none';
        moduleDbOptButton.style.display = 'flex';
    });

    document.getElementById('kolla').addEventListener('click', () => {
        currentModule = 'kolla';
        deployOptions.style.display = 'none';
        moduleDbOptButton.style.display = 'flex';
    });

    document.getElementById('save-module-db').addEventListener('click', () => {
        console.log('Dentro de save-module-db');

        const dbname = moduleDbNameInput.value;
        const schema = moduleSchemaInput.value;
        const dbusername = moduleDbUsernameInput.value;
        const dbpassword = moduleDbPasswordInput.value;

        // Enviar valores al main process.
        ipcRenderer.send('save-module-database', { module: currentModule, dbname, schema, dbusername, dbpassword });
    });

    document.getElementById('back-module-db').addEventListener('click', () => {
        console.log('Presiono back dentro de DB por Modulo');
        moduleDbOptButton.style.display = 'none';
        deployOptions.style.display = 'flex';
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
        console.log('Presiono save dentro de Settings');
        const repo_url = settingsUrl.value;
        const repo_username = settingsUsername.value;
        const repo_password = settingsPassword.value;

        // Enviar valores al main process.
        ipcRenderer.send('save-settings', { repo_url, repo_username, repo_password });
    });
});