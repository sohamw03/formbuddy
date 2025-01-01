// Context menu item and event listener
chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: "formbuddy",
    title: "FormBuddy",
    type: "normal",
    contexts: ["all"],
  });
});

// Handle token refresh
chrome.identity.onSignInChanged.addListener((account, signedIn) => {
  if (!signedIn) {
    chrome.storage.local.remove(['authToken', 'userInfo']);
  }
});

// Add message handler for auth status
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkAuth') {
    chrome.storage.local.get(['authToken'], function(result) {
      sendResponse({ isAuthenticated: !!result.authToken });
    });
    return true;
  }
});

// Enhanced message handler with logging
chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    console.log('External message received:', request);

    if (request.type === 'AUTH_CALLBACK') {
      console.log('Auth data to store:', {
        sessionToken: request.session.user.accessToken,
        userInfo: request.session.user
      });

      chrome.storage.local.set({
        sessionToken: request.session.user.accessToken,
        userInfo: request.session.user
      }, function() {
        console.log('Auth data stored successfully');
        chrome.runtime.sendMessage({
          type: 'AUTH_COMPLETED',
          session: request.session
        });
        sendResponse({ success: true });
      });
      return true;
    }
  }
);

// Add storage change listener
chrome.storage.onChanged.addListener(function(changes, namespace) {
  console.log('Storage changes:', changes);
});
