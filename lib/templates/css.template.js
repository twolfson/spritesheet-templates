// Load in local modules
var _ = require('underscore');

// Define our css template fn ({items, options}) -> css
function cssTemplate(params) {
  // Localize parameters
  var items = params.items,
      options = params.options;

  // Fallback class naming function
  var classFn = options.cssClass || function defaultCssClass (item) {
        return '.icon-' + item.name;
      };

  // Add class to each of the options
  items.forEach(function saveClass (item) {
    item['class'] = classFn(item);
  });

  // Render mustache template with our items
  var
}

// Export our CSS template
module.exports = cssTemplate;