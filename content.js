(function () {
  // Get the main Wikipedia content container
  const content = document.getElementsByClassName("mw-parser-output");
  if (!content || content.length === 0) {
    console.log("No mw-parser-output element found.");
    return;
  }

  let editedCount = 0; // Counter for edited links

  function processPage() {
    // Process specific tag names within the content
    unlinkTagText("p");
    unlinkTagText("ul");
    unlinkTagText("ol");
    unlinkTagText("dd");
    unlinkTagText("td");

    // Process specific class names within the content
    unlinkClassText("hatnote navigation-not-searchable");
    unlinkClassText("thumbcaption");
    unlinkClassText("infobox-label");
    unlinkClassText("infobox-data plainlist");
    unlinkClassText("infobox-data");``

    // Log the total number of edited links
    console.log(
      `Removed hyperlinks from ${editedCount} elements. Happy camping!`
    );
  }

  // Function to remove <a> tags from elements by tag name,
  // preserving citation links.
  function unlinkTagText(tagName) {
    const container = content[0];
    const elements = container.getElementsByTagName(tagName);
    for (let i = 0; i < elements.length; i++) {
      let replacedHTML = elements[i].innerHTML.replace(
        /<a([^>]+?)>(.*?)<\/a>/g,
        function (match, attr, inner) {
          // If the link is a citation link (href starts with "#cite_note"), leave it unchanged
          if (/href\s*=\s*["']#cite_note/.test(attr)) {
            return match;
          }
          // Increment the counter and remove the anchor, preserving its inner content
          editedCount++;
          return inner;
        }
      );
      elements[i].innerHTML = replacedHTML;
    }
  }

  // Function to remove <a> tags from elements by class name,
  // preserving citation links.
  function unlinkClassText(className) {
    const container = content[0];
    const elements = container.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
      let replacedHTML = elements[i].innerHTML.replace(
        /<a([^>]+?)>(.*?)<\/a>/g,
        function (match, attr, inner) {
          if (/href\s*=\s*["']#cite_note/.test(attr)) {
            return match;
          }
          editedCount++;
          return inner;
        }
      );
      elements[i].innerHTML = replacedHTML;
    }
  }

  // Check the current extension state upon load.
  browser.storage.local.get('enabled').then((result) => {
    if (result.enabled) {
      processPage();
    }
  });

  // Listen for state change messages.
  browser.runtime.onMessage.addListener((message) => {
    if (message.enabled !== undefined) {
      window.location.reload();
    }
  });
})();
