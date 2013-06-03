// Load in local modules
var fs = require('fs'),
    _ = require('underscore'),
    walrus = require('walrus');

// Prepare template
var tmplStr = fs.readFileSync(__dirname + '/css.template.walrus', 'utf8'),
    tmpl = walrus.parse(tmplStr);

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

  // Render and return CSS
  var css = tmpl.compile(params);
  return css;
}

// Export our CSS template
module.exports = cssTemplate;