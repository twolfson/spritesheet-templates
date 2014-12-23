var assert = require('assert');
var stylus = require('stylus');
var utils = require('./utils');

describe('An array of image positions, dimensions, and names', function () {
  utils.setupImages();

  describe('processed by `spritesheet-templates` into Stylus', function () {
    before(function () {
      this.options = {format: 'stylus'};
      this.filename = 'stylus.styl';
    });
    utils.runTemplater();

    utils.assertMatchesAsExpected();

    describe('processed by Stylus into CSS', function () {
      // Process the Stylus
      before(function (done) {
        // Add some stylus which hooks into our result
        var styl = this.result;
        styl += [
          '.feature',
          '  height: $sprite1_height;',
          '  spriteWidth($sprite2)',
          '  spriteImage($sprite3)',
          '',
          '.feature2',
          '  sprite($sprite2)',
          '',
          'sprites($spritesheet_sprites)'
        ].join('\n');

        // Render the stylus
        var that = this;
        stylus.render(styl, function handleStylus (err, css) {
          // Assert no errors and CSS was generated
          assert.strictEqual(err, null);
          assert.notEqual(css, '');

          // Save the CSS and callback
          that.css = css;
          done(err);
        });
      });

      utils.assertValidCss();
    });
  });
});
