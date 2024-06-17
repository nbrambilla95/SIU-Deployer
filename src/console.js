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
    const data = outputQueue.shift();
    outputElement.textContent += data;
    outputElement.scrollTop = outputElement.scrollHeight;
    setTimeout(processQueue, 50);
  };

  window.consoleApi.onOutput((data) => {
    outputQueue.push(data);
    if (!isProcessing) {
      processQueue();
    }
  });
});