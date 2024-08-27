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
    const dbOptButton = document.getElementById('database-options');
    const dbHostInput = document.getElementById('host');
    const dbPortInput = document.getElementById('port');

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

    // Evento para regresar de Gestión a Deploy Options
    document.getElementById('back-gestion-db').addEventListener('click', () => {
        document.getElementById('gestion-options').style.display = 'none';
        deployOptions.style.display = 'flex';
    });

    // Evento para regresar de Autogestión a Deploy Options
    document.getElementById('back-autogestion-db').addEventListener('click', () => {
        document.getElementById('autogestion-options').style.display = 'none';
        deployOptions.style.display = 'flex';
    });

    // Evento para regresar de Preinscripción a Deploy Options
    document.getElementById('back-preinscripcion-db').addEventListener('click', () => {
        document.getElementById('preinscripcion-options').style.display = 'none';
        deployOptions.style.display = 'flex';
    });

    // Evento para regresar de Kolla a Deploy Options
    document.getElementById('back-kolla-db').addEventListener('click', () => {
        document.getElementById('kolla-options').style.display = 'none';
        deployOptions.style.display = 'flex';
    });

    // Función para ocultar todos los divs de opciones
    function hideAllModuleOptions() {
        document.getElementById('gestion-options').style.display = 'none';
        document.getElementById('autogestion-options').style.display = 'none';
        document.getElementById('preinscripcion-options').style.display = 'none';
        document.getElementById('kolla-options').style.display = 'none';
    }

    // Evento para mostrar el div de Gestión
    document.getElementById('gestion').addEventListener('click', () => {
        currentModule = 'gestion';
        deployOptions.style.display = 'none';
        hideAllModuleOptions();
        document.getElementById('gestion-options').style.display = 'flex';
    });

    // Evento para mostrar el div de Autogestión
    document.getElementById('autogestion').addEventListener('click', () => {
        currentModule = 'autogestion';
        deployOptions.style.display = 'none';
        hideAllModuleOptions();
        document.getElementById('autogestion-options').style.display = 'flex';
    });

    // Evento para mostrar el div de Preinscripción
    document.getElementById('preinscripcion').addEventListener('click', () => {
        currentModule = 'preinscripcion';
        deployOptions.style.display = 'none';
        hideAllModuleOptions();
        document.getElementById('preinscripcion-options').style.display = 'flex';
    });

    // Evento para mostrar el div de Kolla
    document.getElementById('kolla').addEventListener('click', () => {
        currentModule = 'kolla';
        deployOptions.style.display = 'none';
        hideAllModuleOptions();
        document.getElementById('kolla-options').style.display = 'flex';
    });

    document.getElementById('save-gestion-db').addEventListener('click', () => handleSaveModuleDb('gestion'));
    document.getElementById('save-autogestion-db').addEventListener('click', () => handleSaveModuleDb('autogestion'));
    document.getElementById('save-preinscripcion-db').addEventListener('click', () => handleSaveModuleDb('preinscripcion'));
    document.getElementById('save-kolla-db').addEventListener('click', () => handleSaveModuleDb('kolla'));

    async function handleSaveModuleDb(module) {
        console.log(`Dentro de save-module-db para ${module}`);

        let dbname, schema, dbusername, dbpassword, emailAyuda, tobaDbname, tobaDbusername, tobaDbpassword;
                
        switch (module) {
            case 'gestion':
                dbname = document.getElementById('gestion-dbname').value;
                schema = document.getElementById('gestion-schema').value;
                dbusername = document.getElementById('gestion-dbusername').value;
                dbpassword = document.getElementById('gestion-dbpassword').value;
                break;
            case 'autogestion':
                dbname = document.getElementById('autogestion-dbname').value;
                schema = document.getElementById('autogestion-schema').value;
                dbusername = document.getElementById('autogestion-dbusername').value;
                dbpassword = document.getElementById('autogestion-dbpassword').value;
                emailAyuda = document.getElementById('autogestion-email-ayuda').value;
                break;
            case 'preinscripcion':
                dbname = document.getElementById('preinscripcion-dbname').value;
                schema = document.getElementById('preinscripcion-schema').value;
                dbusername = document.getElementById('preinscripcion-dbusername').value;
                dbpassword = document.getElementById('preinscripcion-dbpassword').value;
                emailAyuda = document.getElementById('preinscripcion-email-ayuda').value;
                break;
            case 'kolla':
                dbname = document.getElementById('kolla-dbname').value;
                dbusername = document.getElementById('kolla-dbusername').value;
                dbpassword = document.getElementById('kolla-dbpassword').value;
                tobaDbname = document.getElementById('toba-dbname').value;
                tobaDbusername = document.getElementById('toba-dbusername').value;
                tobaDbpassword = document.getElementById('toba-dbpassword').value;
                break;
            default:
                console.error('Módulo no reconocido');
                return;
        }

        ipcRenderer.send('save-module-database', { module, dbname, schema, dbusername, dbpassword, emailAyuda, tobaDbname, tobaDbusername, tobaDbpassword });

        try {
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

            const dbConnected = await window.api.invoke('verify-db-connection', dbConfig);

            if (dbConnected && dbConnected.success) {
                const dbSuccessMessage = document.createElement('p');
                dbSuccessMessage.textContent = `Connected to PostgreSQL database '${dbname}' on host '${db_imported_host}' as user '${dbusername}' successfully!`;
                dbSuccessMessage.className = 'message success';

                document.body.appendChild(dbSuccessMessage);

                // Eliminar el mensaje de éxito después de 5 segundos
                setTimeout(() => {
                    document.body.removeChild(dbSuccessMessage);
                }, 5000);

                let scriptPath;
                switch (module) {
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

            const errorMessage = document.createElement('p');
            errorMessage.textContent = `Failed to connect to the database: ${error.message}`;
            errorMessage.className = 'message error';

            document.body.appendChild(errorMessage);

            setTimeout(() => {
                document.body.removeChild(errorMessage);
            }, 5000);
        }
    }

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

    document.getElementById('select-kolla-old-directory').addEventListener('click', () => {
        window.api.selectDirectoryOrFile('directory').then((path) => {
            document.getElementById('kolla-old-directory').value = path;
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
        const kollaOldDirectoryPath = document.getElementById('kolla-old-directory').value;

        if (kollaRarPath && kollaDirectoryPath && kollaOldDirectoryPath) {
            ipcRenderer.send('save-kolla-update', { rarPath: kollaRarPath, directoryPath: kollaDirectoryPath, oldDirectoryPath: kollaOldDirectoryPath });

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
            errorMessage.textContent = 'Por favor, selecciona los paths.';
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

    document.getElementById('save-gestion-db').addEventListener('click', () => {
        const dbname = document.getElementById('gestion-dbname').value;
        const schema = document.getElementById('gestion-schema').value;
        const dbusername = document.getElementById('gestion-dbusername').value;
        const dbpassword = document.getElementById('gestion-dbpassword').value;

        ipcRenderer.send('save-module-database', {
            module: 'gestion',
            dbname,
            schema,
            dbusername,
            dbpassword
        });
    });

    document.getElementById('save-autogestion-db').addEventListener('click', () => {
        const dbname = document.getElementById('autogestion-dbname').value;
        const schema = document.getElementById('autogestion-schema').value;
        const dbusername = document.getElementById('autogestion-dbusername').value;
        const dbpassword = document.getElementById('autogestion-dbpassword').value;
        const emailAyuda = document.getElementById('autogestion-email-ayuda').value;

        ipcRenderer.send('save-module-database', {
            module: 'autogestion',
            dbname,
            schema,
            dbusername,
            dbpassword,
            emailAyuda
        });
    });

    document.getElementById('save-preinscripcion-db').addEventListener('click', () => {
        const dbname = document.getElementById('preinscripcion-dbname').value;
        const schema = document.getElementById('preinscripcion-schema').value;
        const dbusername = document.getElementById('preinscripcion-dbusername').value;
        const dbpassword = document.getElementById('preinscripcion-dbpassword').value;
        const emailAyuda = document.getElementById('preinscripcion-email-ayuda').value;

        ipcRenderer.send('save-module-database', {
            module: 'preinscripcion',
            dbname,
            schema,
            dbusername,
            dbpassword,
            emailAyuda
        });
    });

    document.getElementById('save-kolla-db').addEventListener('click', () => {
        const dbname = document.getElementById('kolla-dbname').value;
        const dbusername = document.getElementById('kolla-dbusername').value;
        const dbpassword = document.getElementById('kolla-dbpassword').value;
        const emailAyuda = document.getElementById('kolla-email-ayuda').value;

        ipcRenderer.send('save-kolla-database', {
            module: 'kolla',
            dbname,
            dbusername,
            dbpassword,
            emailAyuda
        });
    });
});