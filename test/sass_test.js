var assert = require('assert'),
    exec = require('child_process').exec,
    Tempfile = require('temporary/lib/file'),
    utils = require('./utils');

describe('An array of image positions, dimensions, and names', function () {
  utils.setupImages();

  describe('processed by `json2css` into SASS', function () {
    before(function () {
      this.options = {'format': 'sass'};
      this.filename = 'sass.sass';
    });
    utils.runJson2Css();
    before(function writeSassToFile () {
      // Add some SASS to our result
      var sassStr = this.result;
      sassStr += '\n' + [
        '.feature',
        '  height: $sprite1-height',
        '  @include sprite-width($sprite2)',
        '  @include sprite-image($sprite3)',
        '',
        '.feature2',
        '  @include sprite($sprite2)'
      ].join('\n');

      // Save the SASS to a file for processing
      var tmp = new Tempfile();
      tmp.writeFileSync(sassStr);
      this.tmp = tmp;
    });
    after(function () {
      this.tmp.unlinkSync();
    });

    utils.assertMatchesAsExpected();

    describe('processed by SASS into CSS', function () {
      // Process the SASS
      before(function (done) {
        var that = this;
        exec('sass ' + this.tmp.path, function (err, css, stderr) {
          // Assert no errors during conversion
          assert.strictEqual(stderr, '');
          assert.strictEqual(err, null);
          assert.notEqual(css, '');

          // Save CSS for later and callback
          that.css = css;
          done(err);
        });
      });

      // Assert agains the generated CSS
      utils.assertValidCss();
    });
  });
});
