var isFF = (navigator.userAgent.search("Firefox") >= 0);



function saveOptions(e) {
    e.preventDefault();
    if (isFF)
    {
        browser.storage.local.set({
            amazon_delivercheck_useBW: document.querySelector("#useBW").checked
        });
    } else
    {
        chrome.storage.sync.set({
            amazon_delivercheck_useBW: document.querySelector("#useBW").checked
        });
    }
        
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#useBW").checked = result.amazon_delivercheck_useBW;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
    document.querySelector("#useBW").checked = false;
  }

  if (isFF)
  {
    var getting = browser.storage.local.get("amazon_delivercheck_useBW");
    getting.then(setCurrentChoice, onError);
  } else
  {
      chrome.storage.sync.get("amazon_delivercheck_useBW", setCurrentChoice);
  }
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
