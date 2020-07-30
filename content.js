chrome.storage.local.set({ pageUrl: window.location.href }, function () {
  console.log('Value is set to ' + window.location.href);
});

const infoBtn = document.createElement('button');
infoBtn.addEventListener('click', alertCurrentInfo);
infoBtn.classList.add('info-btn');
infoBtn.innerHTML =
  '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="info" class="svg-inline--fa fa-info fa-w-6" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path fill="currentColor" d="M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z"></path></svg>';

document.body.appendChild(infoBtn);

async function alertCurrentInfo() {
  const title = getChromeValue('pageTitle');
  const url = getChromeValue('pageUrl');
  const [pageTitle, pageUrl] = await Promise.all([title, url]);
  alert(`Current Title: ${pageTitle}\r\n\r\nCurrent URL: ${pageUrl}`);
}

// get from chrome storage
function getChromeValue(key) {
  return new Promise((res, rej) => {
    chrome.storage.local.get([key], function (result) {
      res(result[key]);
    });
  });
}
