(function () {
  // Reload page when receiving a state change message.
  browser.runtime.onMessage.addListener((message) => {
    if (message.enabled !== undefined) {
      window.location.reload();
    }
  });

  // Cache the main content container.
  const containers = document.getElementsByClassName("mw-parser-output");
  if (!containers || containers.length === 0) {
    console.log("[WNL] No mw-parser-output element found.");
    return;
  }
  const container = containers[0];

  let editedCount = 0; // Count of non-citation links removed

  // Tags and class names to process.
  const TAGS_TO_PROCESS = ["p", "ul", "ol", "dd", "td", "figcaption"];
  const CLASSES_TO_PROCESS = [
    "hatnote navigation-not-searchable",
    "thumbcaption",
    "infobox-label",
    "infobox-data plainlist",
    "infobox-data",
    "portal-bar-header",
    "sistersitebox",
    "catlinks"
  ];

  // Remove non-citation links from an HTML string.
  function removeNonCitationLinks(htmlString) {
    return htmlString.replace(/<a([^>]+?)>(.*?)<\/a>/g, (match, attr, inner) => {
      if (/href\s*=\s*["']#cite_note/.test(attr)) return match;
      editedCount++;
      return inner;
    });
  }

  // Process a NodeList of elements.
  function processElements(elements) {
    for (const element of elements) {
      element.innerHTML = removeNonCitationLinks(element.innerHTML);
    }
  }

  // Process all specified tags and classes within the container.
  function processPage() {
    $('.mw-parser-output > p a').addClass('deleted-link');
    $('.mw-parser-output > ul > li a').addClass('deleted-link');
    
  }

  // Check the extension state; process page if enabled.
  browser.storage.local.get("enabled").then((result) => {
    if (result.enabled) {
      processPage();
    } 
  });
})();
