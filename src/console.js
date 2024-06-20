window.addEventListener('DOMContentLoaded', () => {
  const outputElement = document.getElementById('console-output');
  const outputQueue = [];
  let isProcessing = false;

  const processQueue = () => {
    if (outputQueue.length === 0) {
      isProcessing = false;
      return;
    }
    isProcessing = true;
    const { data, isError } = outputQueue.shift();
    const span = document.createElement('span');
    span.textContent = data;
    span.style.color = isError ? 'red' : 'white'; // Estilos para diferenciar stdout y stderr
    outputElement.appendChild(span);
    outputElement.scrollTop = outputElement.scrollHeight;
    setTimeout(processQueue, 50);
  };

  window.consoleApi.onOutput((data, isError = false) => {
    outputQueue.push({ data, isError });
    if (!isProcessing) {
      processQueue();
    }
  });
});