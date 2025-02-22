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

// document.getElementById("toggleTitleButton")?.addEventListener("click", () => {
//     console.log("Toggle title button clicked!");

//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         if (!tabs[0]?.id) {
//             console.error("No active tab found!");
//             return;
//         }

//         console.log("Sending message to content script to change title...");
//         chrome.tabs.sendMessage(tabs[0].id, { changeTitle: true }, (response) => {
//             if (chrome.runtime.lastError) {
//                 console.error("Error sending message:", chrome.runtime.lastError.message);
//             } else {
//                 console.log("Response from content script:", response);
//             }
//         });
//     });
// });
document.getElementById("toggleTitleButton")?.addEventListener("click", () => {
    console.log("Toggle title button clicked!");

    // Find all tabs that contain ChatGPT
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            if (tab.url?.includes("chat.openai.com") || tab.url?.includes("chatgpt.com")) {
                console.log(`🔄 Sending message to tab: ${tab.id} (${tab.url})`);

                // Send message to the content script in each ChatGPT tab
                if (tab.id) {
                    chrome.tabs.sendMessage(tab.id, { changeTitle: true }, (response) => {
                        if (chrome.runtime.lastError) {
                            console.error(`❌ Error sending message to tab ${tab.id}:`, chrome.runtime.lastError.message);
                        } else {
                            console.log(`✅ Title changed in tab ${tab.id}:`, response);
                        }
                    });
                }
            }
        });
    });
});
