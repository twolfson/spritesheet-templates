var assert = require('assert');
var exec = require('child_process').exec;
var configUtils = require('./utils/config');
var testUtils = require('./utils/test');

describe('An retina array of image positions, dimensions, and names', function () {
  testUtils.setInfo(configUtils.retinaMultipleSprites);

  describe.only('processed by `spritesheet-templates` into retina SCSS (Maps)', function () {
    testUtils.runTemplater({format: 'scss_maps_retina'});
    testUtils.assertOutputMatches(__dirname + '/expected_files/scss_maps_retina.scss');

    testUtils.generateCssFile('\n' + [
      '@include retina-sprites($retina-groups);'
    ].join('\n'));

    describe.skip('processed by `sass --scss` (ruby) into CSS', function () {
      // Process the SCSS
      testUtils.processCss(function processScss (cb) {
        exec('sass --scss ' + this.tmp.path, function (err, css, stderr) {
          // Assert no errors during conversion
          assert.strictEqual(stderr, '');
          assert.notEqual(css, '');
          cb(err, css);
        });
      });

      // Assert agains the generated CSS
      testUtils.assertValidCss();
    });
  });
});
