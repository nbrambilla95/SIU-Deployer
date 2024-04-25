window.addEventListener('DOMContentLoaded', () => {
  window.consoleApi.onOutput((data) => {
    const outputElement = document.getElementById('console-output');
    if (outputElement) {
        outputElement.textContent += `${data}\n`;
    }
});
});