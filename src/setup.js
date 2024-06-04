window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('select-directory').addEventListener('click', () => {
        window.api.selectDirectory();
    });

    window.api.onSetDirectory((selectedPath) => {
        console.log('Selected Directory:', selectedPath);
        window.api.setDirectory(selectedPath);
    });
});