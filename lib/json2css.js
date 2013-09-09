// Set up the template store
var mustache = require('mustache'),
    assert = require('assert'),
    fs = require('fs'),
    jsonContentDemux = require('json-content-demux'),
    _ = require('underscore'),
    templates = {};

/**
 * @param {Object[]} input Object to convert into CSS
 * @param {String} input[*].name Name to use for the image
 * @param {Number} input[*].x Horizontal coordinate of top-left corner of image
 * @param {Number} input[*].y Vertical coordinate of top-left corner of image
 * @param {Number} input[*].width Horizontal length of image
 * @param {Number} input[*].height Vertical length of image
 * @param {Number} input[*].total_width Horizontal length of spritesheet
 * @param {Number} input[*].total_height Vertical length of spritesheet
 * @param {Number} input[*].image Path to image itself (used as a URL component)
 * @param {Object} [options] Options to convert JSON with
 * @param {String} [options.format=css] Format to output json in (Available: json, css, less, sass, scss, stylus)
 * @param {Mixed} [options.formatOpts={}] Options to pass through to the formatter
 */
function json2css(input, options) {
  // Fallback options
  options = options || {};

  var format = options.format || 'css',
      template = templates[format],
      formatOpts = options.formatOpts || {};

  // Assert that the template exists
  assert(template, 'The json2css format ' + format + ' could not be found. Please make sure to either add it via addTemplate or the spelling is correct.');

  // Clone the input
  input = JSON.parse(JSON.stringify(input));

  // Downcast the input into an array
  var inputObj = new Input(input);
  inputObj.ensureOffsetAndPx();
  inputObj.escapeImages();

  // Process the input via the template
  input = inputObj['export']();
  var retVal = template({'items': input, 'options': formatOpts});

  // Return the output
  return retVal;
}

function Input(input) {
  this.input = input;
}
Input.prototype = {
  // Helper function to ensure offset values exist as well as values with pixels in the name
  'ensureOffsetAndPx': function () {
    // Iterate over the input and ensure there are offset values as well as pixel items
    this.input.forEach(function (item) {
      // Guarantee offsets exist
      item.offset_x = -item.x;
      item.offset_y = -item.y;

      // Create a px namespace
      var px = {};
      item.px = px;

      // For each of the x, y, offset_x, offset_y, height, width, add a px after that
      ['x', 'y', 'offset_x', 'offset_y', 'height', 'width', 'total_height', 'total_width'].forEach(function (key) {
        px[key] = item[key] + 'px';
      });
    });
  },
  // Helper function to escape images
  'escapeImages': function () {
    // Iterate over the items
    this.input.forEach(function (item) {
      // Grab the image
      var img = item.image;

      // Escape the quotes, parentheses, and whitespace
      // http://www.w3.org/TR/CSS21/syndata.html#uri
      var escapedImg = img.replace(/['"\(\)\s]/g, function encodeCssUri (chr) {
        return '%' + chr.charCodeAt(0).toString(16);
      });

      // Save the escapedImg for later
      item.escaped_image = escapedImg;
    });
  },
  'export': function () {
    return this.input;
  }
};

// Expose the Input to the outside
json2css.Input = Input;

// Helper method to add new templates
function addTemplate(name, fn) {
  templates[name] = fn;
}
function addMustacheTemplate(name, tmplStr) {
  // Break up the template and default options
  var tmplObj = jsonContentDemux(tmplStr),
      defaults = tmplObj.json || {},
      tmpl = tmplObj.content;

  // Generate a function which processes objects through the mustache template
  function templateFn(itemObj) {
    // Set up the defaults for the item object
    _.defaults(itemObj.options, defaults);

    // Render the items via the template
    var retStr = mustache.render(tmpl, itemObj);
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
addTemplate('jsonArray', require(templatesDir + '/json_array.template.js'));
addTemplate('css', require(templatesDir + '/css.template.js'));

var stylusMustache = fs.readFileSync(templatesDir + '/stylus.template.mustache', 'utf8');
addMustacheTemplate('stylus', stylusMustache);

var lessMustache = fs.readFileSync(templatesDir + '/less.template.mustache', 'utf8');
addMustacheTemplate('less', lessMustache);

var sassMustache = fs.readFileSync(templatesDir + '/sass.template.mustache', 'utf8');
addMustacheTemplate('sass', sassMustache);

var scssMustache = fs.readFileSync(templatesDir + '/scss.template.mustache', 'utf8');
addMustacheTemplate('scss', scssMustache);

// Expose json2css
module.exports = json2css;
