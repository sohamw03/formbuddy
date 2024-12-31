// Context menu item and event listener
chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: "formbuddy",
    title: "FormBuddy",
    type: "normal",
    contexts: ["all"],
  });
});
