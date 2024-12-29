// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "findFileInputs") {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        sendResponse({
            found: fileInputs.length > 0,
            count: fileInputs.length
        });
    }
    else if (request.action === "uploadFile") {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        if (fileInputs.length > 0) {
            // Create a File object
            fetch(request.file.data)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], request.file.name, {type: request.file.type});

                    // Create a DataTransfer object and add the file
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);

                    // Set the files property of the first file input
                    fileInputs[0].files = dataTransfer.files;

                    // Dispatch change event
                    const event = new Event('change', { bubbles: true });
                    fileInputs[0].dispatchEvent(event);
                });
        }
    }
    return true;
});
