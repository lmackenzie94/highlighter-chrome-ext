const titleTag = document.getElementById('title');
const urlTag = document.getElementById('url');
// const textTag = document.getElementById('text');

async function init() {
  const title = getChromeValue('pageTitle');
  const url = getChromeValue('pageUrl');
  const [currentTitle, currentUrl] = await Promise.all([title, url]);

  titleTag.innerText = currentTitle;
  urlTag.innerText = currentUrl;
}

// get from chrome storage
function getChromeValue(key) {
  return new Promise((res, rej) => {
    chrome.storage.local.get([key], function (result) {
      res(result[key]);
    });
  });
}

init();
