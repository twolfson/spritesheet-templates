// Set up the template store
var mustache = require('mustache'),
    assert = require('assert'),
    fs = require('fs'),
    templates = {};

/**
 * @param {Object|Object[]} input Object to convert into CSS
 * @param {Object} [options] Options to convert JSON with
 * @param {String} [options.format=json] Format to output json in
 * @param {Mixed} [options.formatOpts={}] Options to pass through to the formatter
 */
function json2css(input, options) {
  // Fallback options
  options = options || {};

  var format = options.format || 'json',
      template = templates[format],
      formatOpts = formatOpts || {};

  // Assert that the template exists
  assert(template, 'The json2css format ' + format + ' could not be found. Please make sure to either add it via addTemplate or the spelling is correct.');

  // Clone the input
  input = JSON.parse(JSON.stringify(input));

  // Downcast the input into an array
  input = inputObjToArr(input);

  // Iterate over the input and ensure there are offset values as well as pixel items
  input.forEach(ensureOffsetAndPx);

  // Process the input via the template
  var retVal = template({'items': input, 'options': formatOpts});

  // Return the output
  return retVal;
}

// Helper function to convert objects into arrays
function inputObjToArr(input) {
  var retArr = input;

  if (!Array.isArray(input)) {
    retArr = [];
    var keys = Object.getOwnPropertyNames(input);
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
      retArr.push(retObj);
    });
  }

  // Return the retArr
  return retArr;
}
json2css.inputObjToArr = inputObjToArr;

// Helper function to ensure offset values exist as well as values with pixels in the name
function ensureOffsetAndPx(item) {
  // Guarantee offsets exist
  item.offset_x = item.offset_x || -item.x;
  item.offset_y = item.offset_y || -item.y;

  // Create a px namespace
  var px = {};
  item.px = px;

  // For each of the x, y, offset_x, offset_y, height, width, add a px after that
  ['x', 'y', 'offset_x', 'offset_y', 'height', 'width'].forEach(function (key) {
    px[key] = item[key] + 'px';
  });

  // Return the item
  return item;
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
var templatesDir = __dirname + '/templates';

addTemplate('json', require(templatesDir + '/json.template.js'));

var stylusMustache = fs.readFileSync(templatesDir + '/stylus.template.mustache', 'utf8');
addMustacheTemplate('stylus', stylusMustache);

// Expose json2css
module.exports = json2css;