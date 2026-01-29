// Triggered when the extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  // Bail early if this is an unsupported page
  if (!tab.id || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('about:')) {
    console.warn('Cannot share this page');
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world: 'MAIN', // Required for navigator.share
      func: () => {
        if (!navigator.share) {
          alert('Web Share API is not supported in this browser');
          return;
        }

        navigator.share({
          title: document.title,
          text: document.title,
          url: window.location.href
        }).catch(err => {
          // Ignore user cancel, log real failures
          if (err.name !== 'AbortError') {
            console.error('Share failed:', err);
          }
        });
      }
    });
  } catch (err) {
    console.error('Script injection failed:', err);
  }
});
