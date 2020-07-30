// global vars
let title = '';
let url = '';
let text = '';

// create context menu items
const saveHighlightMenuItem = {
  id: 'saveHighlight',
  title: 'Save To wikiluke',
  contexts: ['selection'],
};
chrome.contextMenus.create(saveHighlightMenuItem);

const setTitleMenuItem = {
  id: 'setTitle',
  title: 'Set Selected as Title',
  contexts: ['selection'],
};
chrome.contextMenus.create(setTitleMenuItem);

// add listeners
chrome.contextMenus.onClicked.addListener(async function (clickData) {
  url = await getPageUrl();
  alert(url);

  if (clickData.menuItemId === 'setTitle' && clickData.selectionText) {
    // store title to chrome storage
    title = clickData.selectionText.trim();
    alert(`Title: ${title}`);
  } else if (
    clickData.menuItemId === 'saveHighlight' &&
    clickData.selectionText
  ) {
    text = clickData.selectionText.trim();

    const highlightPreview = `${text.substring(0, 60)}...`;

    alert(`TITLE: ${title} | URL: ${url} | TEXT: ${text}`);

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
  alert(
    JSON.stringify({
      title: highlightTitle,
      url: highlightUrl,
      text: highlightText,
    })
  );
  const data = { title, url, text };
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
    iconUrl: 'logo.png',
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

// set page URL
function getPageUrl() {
  return new Promise((res, rej) => {
    chrome.storage.sync.get(['pageUrl'], function (result) {
      res(result.pageUrl);
    });
  });
}
