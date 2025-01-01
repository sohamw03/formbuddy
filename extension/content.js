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

  #formbuddy-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 300px;
    padding: 20px;
    z-index: 10000;
    text-align: center;
    font-family: Arial, sans-serif;
  }

  #formbuddy-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
  }

  #formbuddy-modal button {
    margin: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    font-size: 14px;
    cursor: pointer;
  }

  #formbuddy-modal button:hover {
    background-color: #0056b3;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

async function callFormBuddyAPI(endpoint, options = {}) {
  console.log(`Calling FormBuddy API: ${endpoint}`);
  const { sessionToken } = await chrome.storage.local.get(['sessionToken']);
  if (!sessionToken) {
    console.error('No session token found');
    throw new Error('Not authenticated');
  }

  const url = `http://127.0.0.1:3000/api/${endpoint}`;
  console.log('Making request with token:', sessionToken);

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    console.error('API call failed:', response.status, response.statusText);
    if (response.status === 401) {
      throw new Error('Not authenticated');
    }
    throw new Error(`API call failed: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('API response:', data);
  return data;
}

function injectModal(fileInput) {
  // Remove existing modal if present
  document.querySelector("#formbuddy-modal")?.remove();
  document.querySelector("#formbuddy-overlay")?.remove();

  // Overlay
  const overlay = document.createElement("div");
  overlay.id = "formbuddy-overlay";
  overlay.onclick = () => {
    modal.remove();
    overlay.remove();
  };

  // Modal
  const modal = document.createElement("div");
  modal.id = "formbuddy-modal";

  modal.innerHTML = `
    <p>Select a file to upload:</p>
    <button id="formbuddy-select-btn">Upload File</button>
    <button id="formbuddy-cancel-btn">Cancel</button>
  `;

  // Add functionality to buttons
  modal.querySelector("#formbuddy-select-btn").onclick = async () => {
    try {
      // List files from FormBuddy API first
      const listResponse = await callFormBuddyAPI('list_files', {
        method: 'POST'
      });

      if (listResponse.status) {
        console.log('FormBuddy Files:', listResponse.files);
        const fileNames = listResponse.files.map(f => f.name).join(', ');
        modal.querySelector('p').textContent = `Your files: ${fileNames}\nSelect a new file to upload:`;
      }

      chrome.runtime.sendMessage({
        action: "openFilePicker"
      }, (response) => {
        if (response?.file) {
          // Download and upload the selected file
          fetch(response.file.data)
            .then((res) => res.blob())
            .then((blob) => {
              const file = new File([blob], response.file.name, { type: response.file.type });

              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);

              fileInput.files = dataTransfer.files;

              const event = new Event("change", { bubbles: true });
              fileInput.dispatchEvent(event);

              modal.remove();
              overlay.remove();
            });
        }
      });

    } catch (error) {
      console.error('FormBuddy API Error:', error);
      const errorMsg = 'API Error: ' + error.message;
      modal.querySelector('p').textContent = errorMsg;

      // If unauthorized, redirect to auth
      if (error.message.includes('Not authenticated')) {
        setTimeout(() => window.location.href = 'auth.html', 2000);
      }
    }
  };

  modal.querySelector("#formbuddy-cancel-btn").onclick = () => {
    modal.remove();
    overlay.remove();
  };

  document.body.appendChild(overlay);
  document.body.appendChild(modal);
}

function interceptFileInput(event) {
  const target = event.target;
  if (target.tagName === "INPUT" && target.type === "file") {
    event.preventDefault();
    event.stopPropagation();
    injectModal(target);
  }
}

// Simplified event listeners
document.addEventListener("click", interceptFileInput, true);
document.addEventListener("change", interceptFileInput, true);

// Simplified mutation observer
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) {
        const fileInputs = node.querySelectorAll('input[type="file"]');
        fileInputs.forEach((input) => {
          input.addEventListener("click", interceptFileInput, true);
          input.addEventListener("change", interceptFileInput, true);
        });
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
