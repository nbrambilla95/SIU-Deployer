window.addEventListener('DOMContentLoaded', () => {
    const mainButtons = document.getElementById('container');
    const deployOptions = document.getElementById('deploy-options');
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
  
    document.getElementById('deploy').addEventListener('click', () => {
        mainButtons.style.display = 'none';
        deployOptions.style.display = 'flex';
    });

    document.getElementById('back').addEventListener('click', () => {
        mainButtons.style.display = 'flex';
        deployOptions.style.display = 'none';
    });

    document.getElementById('gestion').addEventListener('click', () => {
        window.api.openConsoleWindow('./scripts/bash/hello-world.sh');
    });
});