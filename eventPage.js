// create context menu items
const saveHighlightMenuItem = {
  id: 'saveHighlight',
  title: 'Save To wikiluke',
  contexts: ['selection'],
};
chrome.contextMenus.create(saveHighlightMenuItem);

const setTitleMenuItem = {
  id: 'setTitle',
  title: 'Set Title',
  contexts: ['selection'],
};
chrome.contextMenus.create(setTitleMenuItem);

// add listeners
chrome.contextMenus.onClicked.addListener(async function (clickData) {
  let title;
  let url;
  let text;

  url = await getChromeValue('pageUrl');
  title = await getChromeValue('pageTitle');

  if (clickData.menuItemId === 'setTitle' && clickData.selectionText) {
    // store title to chrome storage
    const pageTitle = clickData.selectionText.trim();
    title = await setChromeValue('pageTitle', pageTitle);
    alert(`Current title: "${title}"`);
  } else if (
    clickData.menuItemId === 'saveHighlight' &&
    clickData.selectionText
  ) {
    text = clickData.selectionText.trim();

    const highlightPreview = `${text.substring(0, 75)}...`;

    let looksGood = confirm(
      `TITLE: ${title}\r\n\r\nURL: ${url}\r\n\r\nTEXT: ${text}`
    );

    if (!looksGood) {
      alert('Save cancelled');
      return;
    }

    try {
      await saveHighlight(title, url, text);
      createNotification(
        'Highlight Saved Successfully',
        `"${highlightPreview}"`
      );
    } catch (err) {
      createNotification('Error Saving Highlight', err.message);
    }
  }
});

// custom functions
async function saveHighlight(highlightTitle, highlightUrl, highlightText) {
  const data = {
    title: highlightTitle,
    url: highlightUrl,
    text: highlightText,
  };
  const response = await fetch(`https://wikiluke.herokuapp.com/highlights`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json(); // parses JSON response into native JavaScript objects
}

// function that creates a chrome notification
let num = 1;
function createNotification(
  title = 'Notification',
  message = 'Hey smart guy, you forgot to tell me what to say'
) {
  const id = `notification-${num}`;
  const options = {
    type: 'basic',
    iconUrl: 'highlighter.png',
    title,
    message,
    priority: 1,
  };
  chrome.notifications.create(id, options, function () {
    console.log(chrome.runtime.lastError);
  });
  // need this or the notification will only appear once (i.e. not on subsequent highlights)
  chrome.notifications.clear(id);
  num++;
}

// add to chrome storage
function setChromeValue(key, value) {
  return new Promise((res, rej) => {
    chrome.storage.local.set({ [key]: value }, function () {
      res(value);
    });
  });
}

// get from chrome storage
function getChromeValue(key) {
  return new Promise((res, rej) => {
    chrome.storage.local.get([key], function (result) {
      res(result[key]);
    });
  });
}
