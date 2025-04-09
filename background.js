const DEFAULT_ENABLED = true;

// Initialize extension state on startup.
browser.storage.local.get('enabled').then((result) => {
  if (result.enabled === undefined) {
    browser.storage.local.set({ enabled: DEFAULT_ENABLED });
    setIcon(DEFAULT_ENABLED);
  } else {
    setIcon(result.enabled);
  }
});

// Listen for toolbar icon clicks.
browser.browserAction.onClicked.addListener(() => {
  browser.storage.local.get('enabled').then((result) => {
    const newEnabled = !result.enabled;
    browser.storage.local.set({ enabled: newEnabled });
    setIcon(newEnabled);

    // Notify all Wikipedia tabs about the updated state.
    browser.tabs.query({ url: "*://*.wikipedia.org/*" }).then((tabs) => {
      for (let tab of tabs) {
        browser.tabs.sendMessage(tab.id, { enabled: newEnabled });
      }
    });
  });
});

// Update the browser action icon based on state.
function setIcon(enabled) {
  const iconPath = enabled ? "icons/active48.png" : "icons/disabled48.png";
  browser.browserAction.setIcon({ path: iconPath });
}
    