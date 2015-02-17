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
