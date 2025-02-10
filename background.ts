console.log("Background script loaded!");

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
