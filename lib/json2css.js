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
addMustacheTemplate('stylus', fs.readFileSync(__dirname + '/templates/stylus.template.mustache', 'utf8'));

// Expose json2css
module.exports = json2css;

// json2css({
//   "sprite1.png": {
//     "x": 0,
//     "y": 0,
//     "width": 50,
//     "height": 50
//   },
//   "sprite2.jpg": {
//     "x": 0,
//     "y": 50,
//     "width": 50,
//     "height": 50
//   },
//   "sprite3.png": {
//     "x": 0,
//     "y": 100,
//     "width": 100,
//     "height": 200
//   }
// })
// ->
//