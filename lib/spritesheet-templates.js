// Load in our dependencies
var assert = require('assert');
var fs = require('fs');
var _ = require('underscore');
var mustache = require('mustache');
var jsonContentDemux = require('json-content-demux');

/**
 * @param {Object} params Container for parameters
 * @param {Object[]} params.items Array of objects with coordinate data about each sprite on the spritesheet
 * @param {String} params.items.*.name Name to use for the image
 * @param {Number} params.items.*.x Horizontal coordinate of top-left corner of image
 * @param {Number} params.items.*.y Vertical coordinate of top-left corner of image
 * @param {Number} params.items.*.width Horizontal length of image in pixels
 * @param {Number} params.items.*.height Vertical length of image in pixels
 * @param {Object} params.spritesheet Information about spritesheet
 * @param {Number} params.spritesheet.width Horizontal length of image in pixels
 * @param {Number} params.spritesheet.height Vertical length of image in pixels
 * @param {Number} params.spritesheet.image URL to use for spritesheet
 * @param {Object} [options] Optional settings
 * @param {String} [options.spritesheetName="spritesheet"] Prefix to use for spritesheet related variables
 * @param {String} [options.format="css"] Format to generate output in
 * @param {Mixed} [options.formatOpts={}] Options to pass through to the formatter
 */
function templater(params, options) {
  // Assert we were given items and spritesheet
  assert(params, '`spritesheet-templates` expected to receive "params" but did not. Please provide it.');
  assert(params.items, '`spritesheet-templates` expected to receive "params.items" but did not. ' +
    'Please provide it.');
  assert(params.spritesheet, '`spritesheet-templates` expected to receive "params.spritesheet" but did not. ' +
    'Please provide it.');

  // Fallback and localize options
  options = options || {};
  var format = options.format || 'css';
  var template = templater.templates[format];

  // Assert that the template exists
  assert(template, 'The templater format "' + format + '" could not be found. Please make sure to either add ' +
    'it via addTemplate or the spelling is correct.');

  // Deep clone the items and spritesheet
  var items = JSON.parse(JSON.stringify(params.items));
  var spritesheet = JSON.parse(JSON.stringify(params.spritesheet));

  // Add on extra data to spritesheet and each item
  templater.escapeImage(spritesheet);
  templater.ensureOffsetAndPx(spritesheet);
  items.forEach(function addExtraData (item) {
    templater.addSpritesheetProperties(item, spritesheet);
    templater.ensureOffsetAndPx(item);
  });

  // Process the params via the template
  var retVal = template({
    items: items,
    spritesheet: spritesheet,
    spritesheet_name: options.spritesheetName || 'spritesheet',
    options: options.formatOpts || {}
  });

  // Return the output
  return retVal;
}

// Helper function to escape image path
templater.escapeImage = function (spritesheet) {
  // Escape the quotes, parentheses, and whitespace
  // http://www.w3.org/TR/CSS21/syndata.html#uri
  var img = spritesheet.image;
  var escapedImg = img.replace(/['"\(\)\s]/g, function encodeCssUri (chr) {
    return '%' + chr.charCodeAt(0).toString(16);
  });
  spritesheet.escaped_image = escapedImg;
};

// Helper function to add spritesheet info
templater.addSpritesheetProperties = function (item, spritesheet) {
  // Save spritesheet info
  item.image = spritesheet.image;
  item.escaped_image = spritesheet.escaped_image;
  item.total_width = spritesheet.width;
  item.total_height = spritesheet.height;
};

// Helper function to ensure offset values exist as well as values with pixels in the name
templater.ensureOffsetAndPx = function (item) {
  // Guarantee offsets exist
  if (item.x !== undefined) {
    item.offset_x = -item.x;
  }
  if (item.y !== undefined) {
    item.offset_y = -item.y;
  }

  // Create a px namespace
  var px = {};
  item.px = px;

  // For each of the x, y, offset_x, offset_y, height, width, add a px after that
  ['x', 'y', 'offset_x', 'offset_y', 'height', 'width', 'total_height', 'total_width'].forEach(function (key) {
    if (item[key] !== undefined) {
      px[key] = item[key] + 'px';
    }
  });
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
