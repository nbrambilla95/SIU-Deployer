window.addEventListener('DOMContentLoaded', () => {
    // Referencias a los contenedores de botones
    const mainButtons = document.getElementById('container');
    const deployOptions = document.getElementById('deploy-options');

    // Event listener para el botón 'Deploy'
    document.getElementById('deploy').addEventListener('click', () => {
        // Oculta los botones principales y muestra los botones de deploy
        mainButtons.style.display = 'none';
        deployOptions.style.display = 'flex'; // Usa 'block' si prefieres no usar flex
    });

    // Suponiendo que hay un botón para regresar a los botones principales
    // Este botón debería estar definido en tu HTML dentro del div 'deploy-options'
    // <button id="back">Back</button>
    document.getElementById('back').addEventListener('click', () => {
        // Muestra los botones principales y oculta los botones de deploy
        mainButtons.style.display = 'flex';
        deployOptions.style.display = 'none';
    });

    // Event listener para el botón 'Database'
    document.getElementById('database').addEventListener('click', () => {
        // Oculta los botones principales y muestra los inputs de database
        mainButtons.style.display = 'none';
        document.getElementById('database-options').style.display = 'flex'; // Usa 'block' si prefieres no usar flex
    });

    // Listener para el botón 'Back' en la sección Database
    document.getElementById('back-db').addEventListener('click', () => {
        // Muestra los botones principales y oculta los inputs de database
        mainButtons.style.display = 'flex';
        document.getElementById('database-options').style.display = 'none';
    });
    // Puedes agregar listeners adicionales para otros botones si es necesario
});