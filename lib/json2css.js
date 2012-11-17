// Set up the template store
var mustache = require('mustache'),
    assert = require('assert'),
    fs = require('fs'),
    templates = {};

/**
 * @param {Object|Object[]} input Object to convert into CSS
 * @param {Object} [options] Options to convert JSON with
 * @param {String} [options.format=stylus] Format to output json in
 */
function json2css(input, options) {
  // Fallback options
  options = options || {};

  var format = options.format || 'stylus',
      template = templates[format];

  // Assert that the template exists
  assert(template, 'The json2css format ' + format + ' could not be found. Please make sure to either add it via addTemplate or the spelling is correct.');

  // Downcast the input into an array
  if (!Array.isArray(input)) {
    var _input = [],
        keys = Object.getOwnPropertyNames(input);
    keys.forEach(function (key) {
      // Create a new item with the name as the key
      var item = input[key],
          retObj = {
            'name': key,
            'width': item.width,
            'height': item.height,
            'x': item.x,
            'y': item.y
          };

      // Save the item to the input
      _input.push(retObj);
    });

    // Replace out the input
    input = _input;
  }

  // Process the input via the template
  var retVal = template({'items': input});

  // Return the output
  return retVal;
}

// Helper method to add new templates
function addTemplate(name, fn) {
  templates[name] = fn;
}
function addMustacheTemplate(name, tmpl) {
  // Generate a function which processes objects through the mustache template
  function templateFn(items) {
    // Render the items via the template
    var retStr = mustache.render(tmpl, items);
    return retStr;
  }

  // Save the template
  addTemplate(name, templateFn);
}

// Expose template system
json2css.addTemplate = addTemplate;
json2css.addMustacheTemplate = addMustacheTemplate;
json2css.templates = templates;

// Add in the templates from templates
var templatesDir = __dirname + '/templates',
    stylusMustache = fs.readFileSync(templatesDir + '/stylus.template.mustache', 'utf8');
addMustacheTemplate('stylus', stylusMustache);

// Expose json2css
module.exports = json2css;