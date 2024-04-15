window.addEventListener('DOMContentLoaded', () => {
    const mainButtons = document.getElementById('container');
    const deployOptions = document.getElementById('deploy-options');

    // Event listener para el botón 'Deploy'
    document.getElementById('deploy').addEventListener('click', () => {
        // Oculta los botones principales y muestra los botones de deploy
        mainButtons.style.display = 'none';
        deployOptions.style.display = 'flex';
    });

    document.getElementById('back').addEventListener('click', () => {
        // Muestra los botones principales y oculta los botones de deploy
        mainButtons.style.display = 'flex';
        deployOptions.style.display = 'none';
    });

    // Event listener para el botón 'Database'
    document.getElementById('database').addEventListener('click', () => {
        // Oculta los botones principales y muestra los inputs de database
        mainButtons.style.display = 'none';
        document.getElementById('database-options').style.display = 'flex';
    });

    // Listener para el botón 'Back' en la sección Database
    document.getElementById('back-db').addEventListener('click', () => {
        // Muestra los botones principales y oculta los inputs de database
        mainButtons.style.display = 'flex';
        document.getElementById('database-options').style.display = 'none';
    });

    // Accion al presionar el boton Gestion
    document.getElementById('gestion').addEventListener('click', () => {
        window.api.runScript('./scripts/bash/hello-world.sh', (output) => {
            console.log(output);
        });
    });

    // Accion al presionar el boton Autogestion
    document.getElementById('autogestion').addEventListener('click', () => {
        window.api.runScript('./scripts/bash/autogestion-deploy.sh', (output) => {
            console.log(output);
        });
    });

    // Accion al presionar el boton Preinscripcion
    document.getElementById('preinscripcion').addEventListener('click', () => {
        window.api.runScript('./scripts/bash/preinscripcion-deploy.sh', (output) => {
            console.log(output);
        });
    });

    // Accion al presionar el boton Kolla
    document.getElementById('kolla').addEventListener('click', () => {
        window.api.runScript('./scripts/bash/kolla-deploy.sh', (output) => {
            console.log(output);
        });
    });
});