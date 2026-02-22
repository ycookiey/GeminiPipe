chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type !== 'open-window') return;
  chrome.windows.create({ url: msg.url, type: 'normal' }, () => {
    if (sender.tab) {
      chrome.tabs.remove(sender.tab.id, () => void chrome.runtime.lastError);
    }
  });
});
