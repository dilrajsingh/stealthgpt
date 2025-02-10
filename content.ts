console.log("Content script loaded!");


// Keep track of the current background state
let isYellow: boolean = false;

// Function to toggle the background color
function toggleBackgroundColor(): void {
    const body = document.body;

    if (!body) {
        console.error("Could not find the body element!");
        return;
    }

    body.style.backgroundColor = isYellow ? "white" : "olive";
    isYellow = !isYellow;

    console.log(`Background color changed to ${isYellow ? "yellow" : "olive"}`);
}

// toggleBackgroundColor(); // Initial call to set the background color


// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.toggleBackground) {
        toggleBackgroundColor();
        sendResponse({ status: "Background toggled" });
    }
});
