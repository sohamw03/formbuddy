document.addEventListener('DOMContentLoaded', function() {
  debugger; // This will pause execution when DevTools is open
  const loginButton = document.getElementById('loginButton');
  const status = document.getElementById('status');
  const NEXTAUTH_URL = 'http://127.0.0.1:3000';

  // Enhanced auth check with logging
  chrome.storage.local.get(['sessionToken', 'userInfo'], function(result) {
    debugger; // Check what's in storage
    console.log('Current stored auth:', result);
    if (result.sessionToken) {
      window.location.href = 'index.html';
    } else {
      status.textContent = 'Please sign in';
    }
  });

  // Enhanced message listener with logging
  chrome.runtime.onMessage.addListener(function(request) {
    console.log('Auth message received:', request);
    if (request.type === 'AUTH_CALLBACK' || request.type === 'AUTH_COMPLETED') {
      window.location.href = 'index.html';
    }
  });

  loginButton.addEventListener('click', function() {
    const callbackUrl = `${NEXTAUTH_URL}/api/auth/extension-callback`;
    const authUrl = `${NEXTAUTH_URL}/api/auth/signin/google?` +
      new URLSearchParams({
        callbackUrl: callbackUrl,
        json: 'true'
      }).toString();

    chrome.windows.create({
      url: authUrl,
      type: 'popup',
      width: 600,
      height: 700
    });
  });
});
