(function () {
  // Get the main Wikipedia content area
  const content = document.getElementsByClassName("mw-parser-output");
  if (!content || content.length === 0) {
    console.log("No mw-parser-output element found.");
    return;
  }

  let editedCount = 0; // Counter for non-citation links processed

  // Removes non-citation links from specified tags and classes
  function processPage() {
    // Process by tag names
    unlinkTagText("p");
    unlinkTagText("ul");
    unlinkTagText("ol");
    unlinkTagText("dd");
    unlinkTagText("td");

    // Process by class names
    unlinkClassText("hatnote navigation-not-searchable");
    unlinkClassText("thumbcaption");
    unlinkClassText("infobox-label");
    unlinkClassText("infobox-data plainlist");
    unlinkClassText("infobox-data");

    console.log(`Removed hyperlinks from ${editedCount} elements. Happy camping!`);
  }

  // Remove <a> tags from elements by tag name, preserving citation links.
  function unlinkTagText(tagName) {
    const container = content[0];
    const elements = container.getElementsByTagName(tagName);
    for (let i = 0; i < elements.length; i++) {
      // The regex matches <a> tags with their attributes (first capture) and inner HTML (second capture)
      let replacedHTML = elements[i].innerHTML.replace(/<a([^>]+?)>(.*?)<\/a>/g, function (match, attr, inner) {
        // If the href starts with "#cite_note", it's a citation link—leave it intact.
        if (/href\s*=\s*["']#cite_note/.test(attr)) {
          return match;
        }
        // Otherwise, remove the <a> tag and increment the counter.
        editedCount++;
        return inner;
      });
      elements[i].innerHTML = replacedHTML;
    }
  }

  // Remove <a> tags from elements by class name, preserving citation links.
  function unlinkClassText(className) {
    const container = content[0];
    const elements = container.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
      let replacedHTML = elements[i].innerHTML.replace(/<a([^>]+?)>(.*?)<\/a>/g, function (match, attr, inner) {
        if (/href\s*=\s*["']#cite_note/.test(attr)) {
          return match;
        }
        editedCount++;
        return inner;
      });
      elements[i].innerHTML = replacedHTML;
    }
  }

  // Check the saved extension state on load; if enabled, process the page.
  browser.storage.local.get("enabled").then((result) => {
    if (result.enabled) {
      processPage();
    }
  });

  // Listen for state change messages and reload the page when toggled.
  browser.runtime.onMessage.addListener((message) => {
    if (message.enabled !== undefined) {
      window.location.reload();
    }
  });
})();
