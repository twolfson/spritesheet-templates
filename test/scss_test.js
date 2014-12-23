var assert = require('assert'),
    exec = require('child_process').exec,
    Tempfile = require('temporary/lib/file'),
    utils = require('./utils');

describe('An array of image positions, dimensions, and names', function () {
  utils.setupImages();

  describe('processed by `json2css` into SCSS', function () {
    before(function () {
      this.options = {'format': 'scss'};
      this.filename = 'scss.scss';
    });
    utils.runJson2Css();

    before(function writeScssToFile () {
      // Add some SCSS to our result
      var scssStr = this.result;
      scssStr += '\n' + [
        '.feature {',
        '  height: $sprite1-height;',
        '  @include sprite-width($sprite2);',
        '  @include sprite-image($sprite3);',
        '}',
        '',
        '.feature2 {',
        '  @include sprite($sprite2);',
        '}'
      ].join('\n');

      // Save the SCSS to a file for processing
      var tmp = new Tempfile();
      tmp.writeFileSync(scssStr);
      this.tmp = tmp;
    });
    after(function () {
      this.tmp.unlinkSync();
    });

    utils.assertMatchesAsExpected();

    describe('processed by `sass --scss` (ruby) into CSS', function () {
      // Process the SCSS
      before(function (done) {
        var that = this;
        exec('sass --scss ' + this.tmp.path, function (err, css, stderr) {
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

    describe('processed by `sassc` (libsass) into CSS', function () {
      // Process the SCSS
      before(function (done) {
        var that = this;
        exec('sassc ' + this.tmp.path, function (err, css, stderr) {
          assert.strictEqual(stderr, '');
          assert.strictEqual(err, null);
          assert.notEqual(css, '');
          that.css = css;
          done(err);
        });
      });
      utils.assertValidCss();
    });
  });
});
