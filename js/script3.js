const xpath = "//div";
const result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
let node = null;
const tagNames = [];
while (node = result.iterateNext()) {
  tagNames.push(node.localName);
}

console.log(tagNames)