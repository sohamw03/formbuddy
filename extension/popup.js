if ("caches" in window) {
  caches.keys().then((cacheNames) => {
    cacheNames.forEach((cacheName) => caches.delete(cacheName));
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const uploadButton = document.getElementById("uploadButton");
  const fileInput = document.getElementById("fileInput");
  const status = document.getElementById("status");
  let foundInput = false;

  // Send message to content script to find file inputs
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "findFileInputs" }, function (response) {
      if (response && response.found) {
        foundInput = true;
        status.textContent = "Found " + response.count + " file input(s)";
      } else {
        foundInput = false;
        status.textContent = "No file inputs found on page";
      }
    });
  });
  if (foundInput)
    uploadButton.addEventListener("click", function () {
      fileInput.click(); // Open file selector
    });

  fileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      // Send the file to content script
      const reader = new FileReader();
      reader.onload = function (e) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "uploadFile",
            file: {
              name: file.name,
              type: file.type,
              data: e.target.result,
            },
          });
        });
      };
      reader.readAsDataURL(file);
      status.textContent = "Uploading: " + file.name;
    }
  });
});
