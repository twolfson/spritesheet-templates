// Load in local modules
var fs = require('fs');
var handlebars = require('handlebars');
var tmpl = fs.readFileSync(__dirname + '/css_retina.template.handlebars', 'utf8');

// Define our retina css template fn ({retina_groups, options}) -> css
function cssTemplate(data) {
  // Localize parameters
  var retinaGroups = data.retina_groups;
  var options = data.options;

  // Fallback class naming function
  var selectorFn = options.cssSelector || function defaultCssClass (retinaGroup) {
    return '.icon-' + retinaGroup.name;
  };

  // Add class to each of the options
  retinaGroups.forEach(function saveClass (retinaGroup) {
    retinaGroup.selector = selectorFn(retinaGroup);
  });

  // Render and return CSS
  var css = handlebars.compile(tmpl)(data);
  return css;
}

// Export our CSS template
module.exports = cssTemplate;
