// Load in local modules
var fs = require('fs');
var handlebars = require('handlebars');
var tmpl = fs.readFileSync(__dirname + '/css.template.handlebars', 'utf8');

// Define our css template fn ({sprites, options}) -> css
function cssTemplate(params) {
  // Localize parameters
  var sprites = params.sprites;
  var options = params.options;

  // TODO: We are thinking about going back to names and then doing our mapping on our own...
  // TODO: This could work... since we *should* always need the items to line up and the pairs is a doubling of the same info

  // Fallback class naming function
  // TODO: Pass through the group instead
  var selectorFn = options.cssSelector || function defaultCssClass (sprite) {
    return '.icon-' + sprite.name;
  };

  // Add class to each of the options
  sprites.forEach(function saveClass (sprite) {
    sprite.selector = selectorFn(sprite);
  });

  // Render and return CSS
  var css = handlebars.compile(tmpl)(params);
  return css;
}

// Export our CSS template
module.exports = cssTemplate;
