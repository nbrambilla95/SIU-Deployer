document.addEventListener('DOMContentLoaded', () => {
    window.consoleApi.receive('console-output', (data) => {
      const outputElement = document.getElementById('console-output');
      if (outputElement) {
        outputElement.textContent += `${data}\n`;
      }
    });
  });