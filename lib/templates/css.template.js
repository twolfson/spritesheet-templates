// Load in local modules
var fs = require('fs'),
    _ = require('underscore'),
    mustache = require('mustache'),
    tmpl = fs.readFileSync(__dirname + '/css.template.mustache', 'utf8');

// Define our css template fn ({items, options}) -> css
function cssTemplate(params) {
  // Localize parameters
  var items = params.items,
      options = params.options;

  // Fallback class naming function
  var classFn = options.cssClass || function defaultCssClass (item) {
        return '.icon-' + item.name;
      };

  // Iterate over the items
  var classArr = [];
  items.forEach(function saveClass (item) {
    // Determine its class
    var klass = classFn(item);

    // Save it to the item and for later
    item['class'] = klass;
    classArr.push(klass);
  });

  // Join together all the classes and save it
  params.allClasses = classArr.join(', ');

  // Render and return CSS
  var css = mustache.render(tmpl, params);
  return css;
}

// Export our CSS template
module.exports = cssTemplate;