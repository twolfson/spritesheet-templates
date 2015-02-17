var utils = require('./utils');

describe('An array of image positions, dimensions, and names', function () {
  utils.setupImages();

  describe('processed by `spritesheet-templates` into LESS with variableNameTransforms', function () {
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

  describe('processed by `spritesheet-templates` via custom template with variableNameTransforms', function () {
    before(function () {
      this.options = {
        format: 'custom-template'
      };
      this.filename = 'custom-template.less';
    });
    utils.runTemplater();

    utils.assertMatchesAsExpected();
  });
});
