var assert = require('assert'),
    stylus = require('stylus'),
    utils = require('./utils');

describe('An array of image positions, dimensions, and names', function () {
  utils.setupImages();

  describe('processed by `json2css` into Stylus', function () {
    before(function () {
      this.options = {'format': 'stylus'};
      this.filename = 'stylus.styl';
    });
    utils.runJson2Css();

    utils.assertMatchesAsExpected();
    it('is valid Stylus', function (done) {
      // Add some stylus which hooks into our result
      var styl = this.result;
      styl += [
        '.feature',
        '  height: $sprite1_height;',
        '  spriteWidth($sprite2)',
        '  spriteImage($sprite3)',
        '',
        '.feature2',
        '  sprite($sprite2)'
      ].join('\n');

      // Render the stylus
      var stylus = require('stylus');

      stylus.render(styl, function handleStylus (err, css) {
        // Assert no errors and validity of CSS
        assert.strictEqual(err, null);
        assert.notEqual(css, '');

        // TODO: Validate CSS
        // console.log('Stylus', css);

        // Callback
        done(err);
      });
    });
  });
});
