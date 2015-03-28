var configUtils = require('./utils/config');
var testUtils = require('./utils/test');

describe('An retina array of image positions, dimensions, and names', function () {
  testUtils.setInfo(configUtils.retinaMultipleSprites);

  describe.skip('processed by `spritesheet-templates` into retina CSS', function () {
    testUtils.runTemplater({format: 'css_retina'});
    testUtils.assertOutputMatches(__dirname + '/expected_files/css_retina.css');

    it.skip('is valid CSS', function (done) {
      var css = this.result;
      testUtils._assertValidCss(css, done);
    });
  });
});
