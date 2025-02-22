console.log("Content script loaded!");

// Keep track of states for background color and disguise
let isYellow: boolean = false;
let disguised: boolean = false;

/**
 * Toggles the background color of the page.
 */
function toggleBackgroundColor(): void {
    const body = document.body;

    if (!body) {
        console.error("Could not find the body element!");
        return;
    }

    const colour = 'yellow'
    body.style.backgroundColor = isYellow ? "white" : colour;
    isYellow = !isYellow;

    console.log(`Background color changed to ${isYellow ? colour : "white"}`);
}

/**
 * Creates a fake news overlay and adds it to the page.
 */
function createFakeNewsOverlay(): void {
    if (document.getElementById("fakeNewsOverlay")) {
        console.warn("Fake news overlay already exists.");
        return;
    }

    const overlay = document.createElement("div");
    overlay.id = "fakeNewsOverlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "white";
    overlay.style.zIndex = "9999";
    overlay.style.overflow = "auto";
    overlay.style.display = "none";
    overlay.innerHTML = `
        <iframe src="https://www.bbc.com/news" style="width:100%; height:100%; border:none;"></iframe>
    `;
    document.body.appendChild(overlay);

    console.log("Fake news overlay created.");
}

/**
 * Toggles the visibility of the fake news overlay.
 */
function toggleDisguise(): void {
    const overlay = document.getElementById("fakeNewsOverlay");
    if (!overlay) {
        console.error("Fake news overlay not found!");
        return;
    }

    overlay.style.display = overlay.style.display === "none" ? "block" : "none";
    disguised = !disguised;

    console.log(`Fake news overlay is now ${disguised ? "visible" : "hidden"}.`);
}

// Initialize by creating the fake news overlay
createFakeNewsOverlay();

/**
 * Listen for messages from the popup or background script.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.toggleBackground) {
        toggleBackgroundColor();
        sendResponse({ status: "Background toggled" });
    } else if (request.toggleDisguise) {
        toggleDisguise();
        sendResponse({ status: "Disguise toggled" });
    } else {
        console.warn("Unknown request received:", request);
    }
});





let originalTitle: string = document.title;
let isTitleChanged: boolean = false;

function toggleTabTitle(): void {
    if (document.title.includes("ChatGPT")) {
        document.title = isTitleChanged ? originalTitle : "Home - BBC News";
        isTitleChanged = !isTitleChanged;
        console.log(`🔄 Tab title changed to: ${document.title}`);
    } else {
        console.log("✅ Title doesn't match ChatGPT, ignoring...");
    }
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.changeTitle) {
        toggleTabTitle();
        sendResponse({ status: "Title toggled" });
    }
});
