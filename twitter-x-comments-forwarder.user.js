// ==UserScript==
// @name     Twitter X Comments forwarder
// @version  1
// @include  *
// @grant    none
// ==/UserScript==

// Define the target strings to search for in the "aria-label" attribute
const targetStrings = ["replies", "reposts", "likes", "bookmarks", "views"];

// Function to make an element and its children click-through by setting `pointer-events: none`
function makeClickThrough(element) {
  // Set pointer-events: none to make the element click-through
  element.style.pointerEvents = "none";

  // Recursively apply to all child elements
  Array.from(element.children).forEach(child => makeClickThrough(child));
}

// Function to find and process matching elements
function processMatchingElements() {
  // Select all elements with an "aria-label" attribute
  const elements = document.querySelectorAll('[aria-label]');

  // Filter elements whose "aria-label" contains any of the target strings
  elements.forEach(element => {
    const ariaLabel = element.getAttribute("aria-label").toLowerCase();
    if (targetStrings.some(str => ariaLabel.includes(str))) {
      makeClickThrough(element);
    }
  });
}

// Run the function initially to handle elements that are already on the page
processMatchingElements();

// Set up a MutationObserver to watch for changes in the DOM
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    // Process only added nodes
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach(node => {
        // Check if the added node is an element
        if (node.nodeType === Node.ELEMENT_NODE) {
          // If the element has the target "aria-label", make it click-through
          const ariaLabel = node.getAttribute("aria-label");
          if (ariaLabel && targetStrings.some(str => ariaLabel.toLowerCase().includes(str))) {
            makeClickThrough(node);
          }

          // Process all children of the added element for matching "aria-label"
          node.querySelectorAll('[aria-label]').forEach(child => {
            const childAriaLabel = child.getAttribute("aria-label").toLowerCase();
            if (targetStrings.some(str => childAriaLabel.includes(str))) {
              makeClickThrough(child);
            }
          });
        }
      });
    }
  }
});

// Start observing the document body for changes
observer.observe(document.body, {
  childList: true,
  subtree: true
});