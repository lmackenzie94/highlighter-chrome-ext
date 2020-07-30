chrome.storage.sync.set({ pageUrl: window.location.href }, function () {
  console.log('Value is set to ' + window.location.href);
});
