console.log("🔄 Background script loaded! Ready to reload StealthGPT.");

const EXTENSION_ID = "ojlgfkolmbmpgkieibjobjgameeefedn"; 
const RELOAD_TRIGGER_HOSTNAME = "reload.extensions";

// Function to reload the specific extension
async function reloadStealthGPT() {
    console.log(`🔄 Attempting to reload extension: ${EXTENSION_ID}`);

    // Get extension info
    chrome.management.get(EXTENSION_ID, async function (extension) {
        if (chrome.runtime.lastError) {
            console.error("⚠️ Error getting extension info:", chrome.runtime.lastError.message);
            return;
        }

        if (extension?.installType === "development" && extension.enabled) {
            console.log(`🔁 Reloading: ${extension.name}`);

            // Disable and re-enable the extension to force reload
            await chrome.management.setEnabled(EXTENSION_ID, false);
            await chrome.management.setEnabled(EXTENSION_ID, true);
            console.log(`✅ Successfully reloaded ${extension.name}`);
        } else {
            console.warn("⚠️ Extension not found or not in development mode.");
        }
    });

    // Reload the current tab after extension reload
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        if (tabs.length === 0) return;
        const currentUrl = new URL(tabs[0].url || "");

        // Avoid reloading if on a restricted page
        if (currentUrl.hostname !== RELOAD_TRIGGER_HOSTNAME) {
            if (tabs[0].id !== undefined) {
                chrome.tabs.reload(tabs[0].id);
            }
            console.log("🔄 Reloaded the active tab.");
        }
    });

    // Show a quick "OK" badge to indicate success
    chrome.action.setBadgeText({ text: "OK" });
    chrome.action.setBadgeBackgroundColor({ color: "#4cb749" });
    setTimeout(() => chrome.action.setBadgeText({ text: "" }), 1000);
}

// Listen for a shortcut (Ctrl+Shift+R) to reload the extension
chrome.commands.onCommand.addListener((command) => {
    if (command === "reload") {
        console.log("⌨️ Keyboard shortcut triggered: Reload StealthGPT");
        reloadStealthGPT();
    }
});

// Manually reload when clicking the extension icon
chrome.action.onClicked.addListener(() => {
    console.log("🖱️ Extension icon clicked: Reloading StealthGPT");
    reloadStealthGPT();
});

console.log("✅ StealthGPT Reload Script Initialized");

chrome.commands.onCommand.addListener((command) => {
    if (command === "toggle_disguise") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs[0]?.id) {
                console.error("No active tab found for the command!");
                return;
            }

            console.log("Sending toggle command from background...");
            chrome.tabs.sendMessage(tabs[0].id, { toggleBackground: true });
        });
    }
});


// Listen for any tab updates (new tabs or navigations)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Only trigger when the page finishes loading
    if (changeInfo.status === "complete" && tab.url) {
        if (tab.url.includes("chat.openai.com") || tab.url.includes("chatgpt.com")) {
            console.log(`🆕 ChatGPT tab detected! Applying tsitle change on tab ${tabId}`);

            // Send message to content script to change the title
            chrome.tabs.sendMessage(tabId, { changeTitle: true }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error(`❌ Error sending message to tab ${tabId}:`, chrome.runtime.lastError.message);
                } else {
                    console.log(`✅ Title automatically changed in tab ${tabId}:`, response);
                }
            });
        }
    }
});

