// Load in our dependencies
var assert = require('assert');
var fs = require('fs');
var _ = require('underscore');
var mustache = require('mustache');
var jsonContentDemux = require('json-content-demux');

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
 * @param {String} [options.format="css"] Format to output json in
 * @param {Mixed} [options.formatOpts={}] Options to pass through to the formatter
 */
function templater(input, options) {
  // Fallback and localize options
  options = options || {};
  var format = options.format || 'css';
  var template = templater.templates[format];

  // Assert that the template exists
  assert(template, 'The templater format "' + format + '" could not be found. Please make sure to either add ' +
    'it via addTemplate or the spelling is correct.');

  // Deep clone the input
  input = JSON.parse(JSON.stringify(input));

  // Add on extra data to each item
  input.items.forEach(function addExtraData (item) {
    templater.ensureOffsetAndPx(item);
    templater.escapeImages(item);
  });

  // Process the input via the template
  var retVal = template({
    items: input,
    options: options.formatOpts || {}
  });

  // Return the output
  return retVal;
}

// Helper function to ensure offset values exist as well as values with pixels in the name
templater.ensureOffsetAndPx = function (item) {
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
};

// Helper function to escape images
templater.escapeImages = function (item) {
  // Grab the image
  var img = item.image;

  // Escape the quotes, parentheses, and whitespace
  // http://www.w3.org/TR/CSS21/syndata.html#uri
  var escapedImg = img.replace(/['"\(\)\s]/g, function encodeCssUri (chr) {
    return '%' + chr.charCodeAt(0).toString(16);
  });

  // Save the escapedImg for later
  item.escaped_image = escapedImg;
};

// Add template store and helper methods to add new templates
templater.templates = {};
templater.addTemplate = function (name, fn) {
  templater.templates[name] = fn;
};
templater.addMustacheTemplate = function (name, tmplStr) {
  // Break up the template and default options
  var tmplObj = jsonContentDemux(tmplStr);
  var defaults = tmplObj.json || {};
  var tmpl = tmplObj.content;

  // Generate a function which processes objects through the mustache template
  function templateFn(itemObj) {
    // Set up the defaults for the item object
    _.defaults(itemObj.options, defaults);

    // Render the items via the template
    var retStr = mustache.render(tmpl, itemObj);
    return retStr;
  }

  // Save the template
  templater.addTemplate(name, templateFn);
};

// TODO: Expose helper functions

// Add in the templates from templates
var templatesDir = __dirname + '/templates';

templater.addTemplate('json', require(templatesDir + '/json.template.js'));
templater.addTemplate('jsonArray', require(templatesDir + '/json_array.template.js'));
templater.addTemplate('css', require(templatesDir + '/css.template.js'));

var stylusMustache = fs.readFileSync(templatesDir + '/stylus.template.mustache', 'utf8');
templater.addMustacheTemplate('stylus', stylusMustache);

var lessMustache = fs.readFileSync(templatesDir + '/less.template.mustache', 'utf8');
templater.addMustacheTemplate('less', lessMustache);

var sassMustache = fs.readFileSync(templatesDir + '/sass.template.mustache', 'utf8');
templater.addMustacheTemplate('sass', sassMustache);

var scssMustache = fs.readFileSync(templatesDir + '/scss.template.mustache', 'utf8');
templater.addMustacheTemplate('scss', scssMustache);

var scssMapsMustache = fs.readFileSync(templatesDir + '/scss_maps.template.mustache', 'utf8');
templater.addMustacheTemplate('scss_maps', scssMapsMustache);

// Expose templater
module.exports = templater;
