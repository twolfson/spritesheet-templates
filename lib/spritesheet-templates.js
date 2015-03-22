// Load in our dependencies
var assert = require('assert');
var fs = require('fs');
var _ = require('underscore');
var _s = require('underscore.string');
var handlebars = require('handlebars');
var handlebarsLayouts = require('handlebars-layouts');
var jsonContentDemux = require('json-content-demux');

// Allow for layouts to occur on `handlebars` templates
handlebarsLayouts.register(handlebars);

/**
 * @param {Object} params Container for parameters
 * @param {Object[]} params.sprites Array of objects with coordinate data about each sprite on the spritesheet
 * @param {String} params.sprites.*.name Name to use for the image
 * @param {Number} params.sprites.*.x Horizontal coordinate of top-left corner of image
 * @param {Number} params.sprites.*.y Vertical coordinate of top-left corner of image
 * @param {Number} params.sprites.*.width Horizontal length of image in pixels
 * @param {Number} params.sprites.*.height Vertical length of image in pixels
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
  // Assert we were given sprites and spritesheet
  assert(params, '`spritesheet-templates` expected to receive "params" but did not. Please provide it.');
  // DEV: Support `params.items` for legacy purposes
  params.sprites = params.sprites || params.items;
  assert(params.sprites, '`spritesheet-templates` expected to receive "params.sprites" but did not. ' +
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

  // Deep clone the sprites and spritesheet
  var sprites = JSON.parse(JSON.stringify(params.sprites));
  var spritesheet = JSON.parse(JSON.stringify(params.spritesheet));
  spritesheet.name = options.spritesheetName || 'spritesheet';

  // Add on extra data to spritesheet and each sprite
  templater.escapeImage(spritesheet);
  templater.ensureTemplateVariables(spritesheet);
  sprites.forEach(function addExtraData (sprite) {
    templater.addSpritesheetProperties(sprite, spritesheet);
    templater.ensureTemplateVariables(sprite);
  });

  // If we have retina sprites, enhance them as well well
  var retinaSprites;
  var retinaSpritesheet;
  var retinaPairs;
  if (params.retinaSprites || params.retinaSpritesheet || params.retinaPairs) {
    assert(params.retinaSprites && params.retinaSpritesheet && params.retinaPairs,
      'Expected "params.retinaSprites", "params.retinaSpritesheet", and "params.retinaPairs" to be provided ' +
      'but at least one of them was missing');
    retinaSprites = JSON.parse(JSON.stringify(params.retinaSprites));
    retinaSpritesheet = JSON.parse(JSON.stringify(params.retinaSpritesheet));
    retinaSpritesheet.name = options.retinaSpritesheetName || 'spritesheet-retina';
    retinaPairs = JSON.parse(JSON.stringify(params.retinaPairs));

    templater.escapeImage(retinaSpritesheet);
    templater.ensureTemplateVariables(retinaSpritesheet);
    retinaSprites.forEach(function addExtraData (retinaSprite) {
      templater.addSpritesheetProperties(retinaSprite, retinaSpritesheet);
      templater.ensureTemplateVariables(retinaSprite);
    });

    // TODO: Add strings to retinaPairs in handlebars fn
    // TODO: Should retinaPairs only be strings for variables or full fledged sprites?
    // TODO: Full fledged sprites for future proofing simpler languages/formats. Also with JSON export we need that data.
  }

  // Process the params via the template
  var retVal = template({
    // DEV: Output `items` for supporting legacy templates
    items: sprites,
    sprites: sprites,
    retina_sprites: retinaSprites,
    spritesheet: spritesheet,
    spritesheet_name: spritesheet.name,
    retina_spritesheet: retinaSpritesheet,
    retina_spritesheet_name: retinaSpritesheet.name,
    retina_pairs: retinaPairs,
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
templater.addSpritesheetProperties = function (sprite, spritesheet) {
  // Save spritesheet info
  sprite.image = spritesheet.image;
  sprite.escaped_image = spritesheet.escaped_image;
  sprite.total_width = spritesheet.width;
  sprite.total_height = spritesheet.height;
};

// Helper function to ensure offset values exist as well as values with pixels in the name
templater.ensureTemplateVariables = function (item) {
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

templater.ensureHandlebarsVariables = function (item, transformFn) {
  // Define strings in the appropriate case
  item.strings = {};

  // If we have a name, add on name keys
  if (item.name) {
    _.extend(item.strings, {
      // icon-home
      name: transformFn(item.name),
      // icon-home-name
      name_name: transformFn(item.name + '-name'),
      // icon-home-x
      name_x: transformFn(item.name + '-x'),
      // icon-home-y
      name_y: transformFn(item.name + '-y'),
      // icon-home-offset-x
      name_offset_x: transformFn(item.name + '-offset-x'),
      // icon-home-offset-y
      name_offset_y: transformFn(item.name + '-offset-y'),
      // icon-home-width
      name_width: transformFn(item.name + '-width'),
      // icon-home-height
      name_height: transformFn(item.name + '-height'),
      // icon-home-total-width
      name_total_width: transformFn(item.name + '-total-width'),
      // icon-home-total-height
      name_total_height: transformFn(item.name + '-total-height'),
      // icon-home-image
      name_image: transformFn(item.name + '-image'),
      // icon-home-sprites
      name_sprites: transformFn(item.name + '-sprites')
    });
  }

  // Bare strings for maps
  _.extend(item.strings, {
    bare_name: transformFn('name'),
    bare_x: transformFn('x'),
    bare_y: transformFn('y'),
    bare_offset_x: transformFn('offset-x'),
    bare_offset_y: transformFn('offset-y'),
    bare_width: transformFn('width'),
    bare_height: transformFn('height'),
    bare_total_width: transformFn('total-width'),
    bare_total_height: transformFn('total-height'),
    bare_image: transformFn('image'),
    bare_sprites: transformFn('sprites')
  });
};

// Add template store and helper methods to add new templates
templater.templates = {};
templater.addTemplate = function (name, fn) {
  templater.templates[name] = fn;
};
templater.addHandlebarsTemplate = function (name, tmplStr) {
  // Break up the template and default options
  var tmplObj = jsonContentDemux(tmplStr);
  var defaults = tmplObj.json || {};
  var tmpl = tmplObj.content;

  // Generate a function which processes objects through the handlebars template
  function templateFn(data) {
    // Set up the defaults for the data
    _.defaults(data.options, defaults);

    // If we want to transform our variables, then transform them
    var transformFn = _.identity;
    var variableNameTransforms = data.options.variableNameTransforms;
    if (variableNameTransforms) {
      assert(Array.isArray(variableNameTransforms),
        '`options.variableNameTransforms` was expected to be an array but it was not');
      transformFn = function (str) {
        var strObj = _s(str);
        variableNameTransforms.forEach(function runTransform (transformKey) {
          strObj = strObj[transformKey]();
        });
        return strObj.value();
      };
    }

    // Generate strings for our variables
    templater.ensureHandlebarsVariables(data, transformFn);
    templater.ensureHandlebarsVariables(data.spritesheet, transformFn);
    data.sprites.forEach(function addHandlebarsVariables (sprite) {
      templater.ensureHandlebarsVariables(sprite, transformFn);
    });

    // If there are retina variables, support those as well
    if (data.retina_spritesheet) {
      templater.ensureHandlebarsVariables(data.retina_spritesheet, transformFn);
    }
    if (data.retina_sprites) {
      data.retina_sprites.forEach(function addHandlebarsVariables (retinaSprite) {
        templater.ensureHandlebarsVariables(retinaSprite, transformFn);
      });
    }

    // Render our template
    var retStr = handlebars.compile(tmpl)(data);
    return retStr;
  }

  // Save the template to our collection as well as handlebars for inheritance
  handlebars.registerPartial(name, tmpl);
  templater.addTemplate(name, templateFn);
};
templater.addMustacheTemplate = templater.addHandlebarsTemplate;

// Add in the templates from templates
var templatesDir = __dirname + '/templates';

templater.addTemplate('json', require(templatesDir + '/json.template.js'));
templater.addTemplate('jsonArray', require(templatesDir + '/json_array.template.js'));
templater.addTemplate('css', require(templatesDir + '/css.template.js'));

var stylusHandlebars = fs.readFileSync(templatesDir + '/stylus.template.handlebars', 'utf8');
templater.addHandlebarsTemplate('stylus', stylusHandlebars);
var stylusRetinaHandlebars = fs.readFileSync(templatesDir + '/stylus-retina.template.handlebars', 'utf8');
templater.addHandlebarsTemplate('stylus-retina', stylusRetinaHandlebars);

var lessHandlebars = fs.readFileSync(templatesDir + '/less.template.handlebars', 'utf8');
templater.addHandlebarsTemplate('less', lessHandlebars);

var sassHandlebars = fs.readFileSync(templatesDir + '/sass.template.handlebars', 'utf8');
templater.addHandlebarsTemplate('sass', sassHandlebars);

var scssHandlebars = fs.readFileSync(templatesDir + '/scss.template.handlebars', 'utf8');
templater.addHandlebarsTemplate('scss', scssHandlebars);

var scssMapsHandlebars = fs.readFileSync(templatesDir + '/scss_maps.template.handlebars', 'utf8');
templater.addHandlebarsTemplate('scss_maps', scssMapsHandlebars);

// Expose templater
module.exports = templater;
