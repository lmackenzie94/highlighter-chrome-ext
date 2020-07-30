// automatically sets the page url
chrome.storage.local.set({ pageUrl: window.location.href });

// automatically gets the page title (assumes there's only one)
chrome.storage.local.set({ pageTitle: getPageH1() });

function getPageH1() {
  const h1s = Array.from(document.getElementsByTagName('h1'));
  return h1s[0].innerText;
}
