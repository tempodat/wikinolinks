(function () {
    // Reload page when receiving a state change message.
    browser.runtime.onMessage.addListener((message) => {
      if (message.enabled !== undefined) {
        linkElem.disabled = !message.enabled;
      }
    });

    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', browser.runtime.getURL('/hidelinks.css'));
    
    // Process all specified tags and classes within the container.
    function processPage() {
        document.getElementsByTagName('head')[0].append(linkElem);
    }
  
    // Check the extension state; process page if enabled.
    browser.storage.local.get("enabled").then((result) => {
      if (result.enabled) {
        processPage();
      } 
    });
  })();
  