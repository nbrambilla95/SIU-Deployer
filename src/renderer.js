window.addEventListener('DOMContentLoaded', () => {
    const mainButtons = document.getElementById('container');
    const deployOptions = document.getElementById('deploy-options');
  
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