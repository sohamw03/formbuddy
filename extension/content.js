const styles = `
  #formbuddy-indicator {
    position: absolute;
    top: 5px;
    right: 5px;
    background: linear-gradient(45deg, #ff6b6b, #ff5757);
    color: white;
    padding: 8px 16px;
    font-size: 14px;
    font-family: Arial, sans-serif;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    opacity: 0.9;
    transition: all 0.2s ease;
    cursor: pointer;
    animation: pulse 2s infinite;
  }

  #formbuddy-indicator:hover {
    opacity: 1;
    transform: scale(1.05);
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "findFileInputs") {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    console.log({ fileInputs });

    for (const fileInput of fileInputs) {
      document.querySelectorAll("#formbuddy-indicator").forEach((el) => el.remove());
      const indicator = document.createElement("div");
      indicator.textContent = "File";
      indicator.id = "formbuddy-indicator";
      fileInput.parentElement.style.position = "relative";
      fileInput.parentElement.appendChild(indicator);
    }
    sendResponse({
      found: fileInputs.length > 0,
      count: fileInputs.length,
    });
  } else if (request.action === "uploadFile") {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    if (fileInputs.length > 0) {
      // Create a File object
      fetch(request.file.data)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], request.file.name, { type: request.file.type });

          // Create a DataTransfer object and add the file
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);

          // Set the files property of the first file input
          fileInputs[0].files = dataTransfer.files;

          // Dispatch change event
          const event = new Event("change", { bubbles: true });
          fileInputs[0].dispatchEvent(event);
        });
    }
  }
  return true;
});
