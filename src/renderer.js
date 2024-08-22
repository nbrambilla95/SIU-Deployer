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

    // Update section
    const updateButton = document.getElementById('update');
    const updateOptions = document.getElementById('update-options');
    const backUpdateButton = document.getElementById('back-update');
    const guaraniUpdateButton = document.getElementById('guarani-update');
    const kollaUpdateButton = document.getElementById('kolla-update');

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
        window.api.openConsoleWindow('bash/check-pre-requisites.sh');
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

        // Mostrar mensaje de éxito
        const successMessage = document.createElement('p');
        successMessage.textContent = 'Data saved successfully!';
        successMessage.className = 'message success';

        document.body.appendChild(successMessage);

        // Eliminar el mensaje de éxito después de 5 segundos
        setTimeout(() => {
            document.body.removeChild(successMessage);
        }, 5000);
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

    document.getElementById('save-module-db').addEventListener('click', async () => {
        console.log('Dentro de save-module-db');

        const dbname = moduleDbNameInput.value;
        const schema = moduleSchemaInput.value;
        const dbusername = moduleDbUsernameInput.value;
        const dbpassword = moduleDbPasswordInput.value;

        // Enviar valores al main process.
        ipcRenderer.send('save-module-database', { module: currentModule, dbname, schema, dbusername, dbpassword });

        // Mostrar mensaje de éxito
        const successMessage = document.createElement('p');
        successMessage.textContent = 'Data saved successfully!';
        successMessage.className = 'message success';

        document.body.appendChild(successMessage);

        // Eliminar el mensaje de éxito después de 5 segundos
        setTimeout(() => {
            document.body.removeChild(successMessage);
        }, 5000);

        // Obtener valores del archivo JSON para `host` y `port`
        const db_imported_host = await window.api.invoke('get-config-value', 'database.host');
        const db_imported_port = await window.api.invoke('get-config-value', 'database.port');

        // Crear objeto de configuración de la base de datos
        const dbConfig = {
            host: db_imported_host,
            port: db_imported_port,
            user: dbusername,
            password: dbpassword,
            database: dbname,
        };

        // Descomentar para tests manuales
        // const dbConfig = {
        //     host: 'localhost',
        //     port: 5432,
        //     user: 'testuser',
        //     password: 'testpassword',
        //     database: 'testdb',
        // };

        try {
            // Verificar conexión a la base de datos antes de ejecutar el script de despliegue
            const dbConnected = await window.api.invoke('verify-db-connection', dbConfig);

            if (dbConnected && dbConnected.success) {
                console.log('Connected to PostgreSQL database');

                // Mostrar mensaje de éxito
                const dbSuccessMessage = document.createElement('p');
                dbSuccessMessage.textContent = `Connected to PostgreSQL database '${dbname}' on host '${db_imported_host}' as user '${dbusername}' successfully!`;
                dbSuccessMessage.className = 'message success';

                document.body.appendChild(dbSuccessMessage);

                // Eliminar el mensaje de éxito después de 5 segundos
                setTimeout(() => {
                    document.body.removeChild(dbSuccessMessage);
                }, 5000);

                // Determinar el script de despliegue correspondiente al módulo
                let scriptPath = '';
                switch (currentModule) {
                    case 'gestion':
                        scriptPath = 'bash/gestion-deploy.sh';
                        break;
                    case 'autogestion':
                        scriptPath = 'bash/autogestion-deploy.sh';
                        break;
                    case 'preinscripcion':
                        scriptPath = 'bash/preinscripcion-deploy.sh';
                        break;
                    case 'kolla':
                        scriptPath = 'bash/kolla-deploy.sh';
                        break;
                    default:
                        console.log('No script defined for this module');
                        return;
                }

                // Abrir la consola y ejecutar el script correspondiente
                window.api.openConsoleWindow(scriptPath);
            } else {
                const errorMsg = dbConnected && dbConnected.error ? dbConnected.error : 'Unknown error';
                throw new Error(errorMsg);
            }
        } catch (error) {
            console.error('Error connecting to PostgreSQL database:', error.message);

            // Mostrar mensaje de error si la conexión a la base de datos falla
            const errorMessage = document.createElement('p');
            errorMessage.textContent = `Failed to connect to the database: ${error.message}`;
            errorMessage.className = 'message error';

            document.body.appendChild(errorMessage);

            // Eliminar el mensaje de error después de 5 segundos
            setTimeout(() => {
                document.body.removeChild(errorMessage);
            }, 5000);
        }
    });

    // Escuchar la respuesta del proceso principal para mostrar mensajes de error
    window.api.onSaveToFileReply((result) => {
        if (!result.success) {
            // Mostrar mensaje de error
            const errorMessage = document.createElement('p');
            errorMessage.textContent = `Failed to save data: ${result.error}`;
            errorMessage.className = 'message error';

            document.body.appendChild(errorMessage);

            // Eliminar el mensaje de error después de 5 segundos
            setTimeout(() => {
                document.body.removeChild(errorMessage);
            }, 5000);
        }
    });

    document.getElementById('back-module-db').addEventListener('click', () => {
        console.log('Presiono back dentro de DB por Modulo');

        // Limpiar los campos de entrada
        moduleDbNameInput.value = '';
        moduleSchemaInput.value = '';
        moduleDbUsernameInput.value = '';
        moduleDbPasswordInput.value = '';

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

        // Mostrar mensaje de éxito
        const successMessage = document.createElement('p');
        successMessage.textContent = 'Data saved successfully!';
        successMessage.className = 'message success';

        document.body.appendChild(successMessage);

        // Eliminar el mensaje de éxito después de 5 segundos
        setTimeout(() => {
            document.body.removeChild(successMessage);
        }, 5000);
    });

    // Mostrar opciones de update cuando se hace clic en "Update"
    updateButton.addEventListener('click', () => {
        console.log('Dentro de Update');
        mainButtons.style.display = 'none';
        updateOptions.style.display = 'flex';
    });

    // Regresar al menú principal desde "Update"
    backUpdateButton.addEventListener('click', () => {
        console.log('Presionó back dentro de Update');
        updateOptions.style.display = 'none';
        mainButtons.style.display = 'flex';
    });

    // Implementar la lógica cuando se selecciona Guaraní
    guaraniUpdateButton.addEventListener('click', () => {
        console.log('Seleccionado Guaraní para actualizar');
        window.api.openConsoleWindow('bash/guarani-update.sh');
    });

    // Implementar la lógica cuando se selecciona Kolla
    kollaUpdateButton.addEventListener('click', () => {
        console.log('Seleccionado Kolla para actualizar');
        document.getElementById('update-options').style.display = 'none';
        document.getElementById('kolla-update-options').style.display = 'block';
    });
    
    document.getElementById('select-kolla-rar').addEventListener('click', () => {
        window.api.selectDirectoryOrFile('file').then((path) => {
            document.getElementById('kolla-rar').value = path;
        });
    });
    
    document.getElementById('select-kolla-directory').addEventListener('click', () => {
        window.api.selectDirectoryOrFile('directory').then((path) => {
            document.getElementById('kolla-directory').value = path;
        });
    });
    
    document.getElementById('save-kolla-update').addEventListener('click', () => {
        const kollaRarPath = document.getElementById('kolla-rar').value;
        const kollaDirectoryPath = document.getElementById('kolla-directory').value;
    
        if (kollaRarPath && kollaDirectoryPath) {
            ipcRenderer.send('save-kolla-update', { rarPath: kollaRarPath, directoryPath: kollaDirectoryPath });
    
            // Mostrar un mensaje de éxito y limpiar los inputs
            const successMessage = document.createElement('p');
            successMessage.textContent = 'Datos de Kolla guardados exitosamente!';
            successMessage.className = 'message success';
            document.body.appendChild(successMessage);
            window.api.openConsoleWindow('bash/kolla-update.sh');
    
            setTimeout(() => {
                document.body.removeChild(successMessage);
            }, 5000);
        } else {
            // Mostrar un mensaje de error si falta alguno de los paths
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Por favor, selecciona ambos paths.';
            errorMessage.className = 'message error';
            document.body.appendChild(errorMessage);
    
            setTimeout(() => {
                document.body.removeChild(errorMessage);
            }, 5000);
        }
    });
    
    document.getElementById('back-kolla-update').addEventListener('click', () => {
        document.getElementById('kolla-update-options').style.display = 'none';
        document.getElementById('update-options').style.display = 'flex';
    });
});