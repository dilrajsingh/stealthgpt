console.log("Popup script loaded!");

document.getElementById("toggleButtonColour")?.addEventListener("click", () => {
    console.log("Toggle button clicked!");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]?.id) {
            console.error("No active tab found!");
            return;
        }

        console.log("Sending message to content script...");
        chrome.tabs.sendMessage(tabs[0].id, { toggleBackground: true }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error sending message:", chrome.runtime.lastError.message);
            } else {
                console.log("Response from content script:", response);
            }
        });
    });
});



document.getElementById("toggleButtonDisguise")?.addEventListener("click", () => {
    console.log("Toggle toggleButtonDisguise button clicked!");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]?.id) {
            console.error("No active tab found!");
            return;
        }

        console.log("Sending message to content script...");
        chrome.tabs.sendMessage(tabs[0].id, { toggleDisguise: true }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error sending message:", chrome.runtime.lastError.message);
            } else {
                console.log("Response from content script:", response);
            }
        });
    });
});
