function jsonArrayTemplate(params) {
  // Delete the strings for unnecessary noise
  var items = params.items;
  items.forEach(function cleanup (item) {
    delete item.strings;
  });

  // Stringify the array of itemsitemObj
  var retStr = JSON.stringify(items, null, 4);

  // Return the stringified JSON
  return retStr;
}

// Export our JSON template
module.exports = jsonArrayTemplate;
