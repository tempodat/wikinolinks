(function () {
  // Get the main Wikipedia content container
  const content = document.getElementsByClassName("mw-parser-output");
  if (!content || content.length === 0) {
    console.log("No mw-parser-output element found.");
    return;
  }

  let removedCount = 0; // Counter for removed elements
  let editedCount = 0; // Counter for edited links

  // Remove distracting elements, lets be honest if you're using this you're not going to be editing wikipedia
  // removeClass("vector-body-before-content");
  // removeClass("vector-page-toolbar");
  // removeClass("mw-editsection");
  // buggy, doesn't always work
  // do this with ublock if you really want to

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
  unlinkClassText("infobox-data");

  function removeClass(className) {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
      elements[i].remove();
    }
    removedCount += elements.length;
  }

  function removeClassText(className) {
    const container = content[0];
    const elements = container.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
        elements[i].remove();
    }
    editedCount += elements.length;
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

  // Log the total number of edited links
  console.log(
    //`[WNL] Removed ${removedCount} elements, removed hyperlinks from ${editedCount} elements. Happy camping, stay focused!`
    `Removed hyperlinks from ${editedCount} elements. Happy camping!`
  );
})();
