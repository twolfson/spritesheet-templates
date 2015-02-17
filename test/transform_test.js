var fs = require('fs');
var templater = require('../');
var utils = require('./utils');

describe('An array of image positions, dimensions, and names', function () {
  utils.setupImages();

  describe('processed by `spritesheet-templates` into LESS with `variableNameTransforms`', function () {
    before(function () {
      this.options = {
        format: 'less',
        formatOpts: {
          variableNameTransforms: ['underscored', 'toUpperCase']
        }
      };
      this.filename = 'less-transform.less';
    });
    utils.runTemplater();

    utils.assertMatchesAsExpected();
  });
});

// DEV: Legacy test
describe('An array of image positions, dimensions, and names', function () {
  utils.setupImages();

  describe('processed by `spritesheet-templates` via custom template with no `variableNameTransforms`', function () {
    before(function () {
      var customTemplate = fs.readFileSync(__dirname + '/test_files/transform_custom.template.mustache', 'utf8');
      templater.addMustacheTemplate('transform_custom', customTemplate);

      this.options = {
        format: 'transform_custom'
      };
      this.filename = 'transform-custom.less';
    });
    utils.runTemplater();

    utils.assertMatchesAsExpected();
  });
});
