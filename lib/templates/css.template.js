// Load in local modules
var fs = require('fs');
var handlebars = require('handlebars');
var tmpl = fs.readFileSync(__dirname + '/css.template.mustache', 'utf8');

// Define our css template fn ({items, options}) -> css
function cssTemplate(params) {
  // Localize parameters
  var items = params.items;
  var options = params.options;

  // Fallback class naming function
  var selectorFn = options.cssSelector || function defaultCssClass (item) {
    return '.icon-' + item.name;
  };

  // Add class to each of the options
  items.forEach(function saveClass (item) {
    item.selector = selectorFn(item);
  });

  // Render and return CSS
  var css = handlebars.compile(tmpl)(params);
  return css;
}

// Export our CSS template
module.exports = cssTemplate;
