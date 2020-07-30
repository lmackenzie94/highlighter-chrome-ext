// automatically sets the page url
chrome.storage.local.set({ pageUrl: window.location.href });

// automatically gets the page title (assumes there's only one)
chrome.storage.local.set({ pageTitle: getPageH1() });

function getPageH1() {
  const h1s = Array.from(document.getElementsByTagName('h1'));
  let h1 = 'No page title was found';
  for (let i = 0; i < h1s.length; i++) {
    if (h1s[i].innerText) {
      h1 = h1s[i].innerText;
      break;
    }
  }
  return h1;
}
