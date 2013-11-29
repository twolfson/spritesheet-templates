var assert = require('assert'),
    utils = require('./utils');

describe('An array of image positions, dimensions, and names', function () {
  utils.setupImages();

  describe('processed by `json2css` into LESS', function () {
    before(function () {
      this.options = {'format': 'less'};
      this.filename = 'less.less';
    });
    utils.runJson2Css();

    utils.assertMatchesAsExpected();
    it('is valid LESS', function (done) {
      // Add some LESS to our result
      var lessStr = this.result;
      lessStr += [
        '.feature {',
        '  height: @sprite1-height;',
        '  .sprite-width(@sprite2);',
        '  .sprite-image(@sprite3);',
        '}',
        '',
        '.feature2 {',
        '  .sprite(@sprite2);',
        '}'
      ].join('\n');

      // Render the LESS, assert no errors, and valid CSS
      var less = require('less');
      less.render(lessStr, function (err, css) {
        assert.strictEqual(err, null);
        assert.notEqual(css, '');

        // console.log('LESS', css);

        // Verify there are no braces in the CSS (array string coercion)
        assert.strictEqual(css.indexOf(']'), -1);

        // Callback
        done(err);
      });
    });
  });
});
