var assert = require('assert'),
    utils = require('./utils');

describe('An array of image positions, dimensions, and names', function () {
  before(function () {
    // TODO: The malicious URL should be placed in a separate test but I want to test every engine and hate the bloat
    this.info = [
      {'name': 'sprite1', 'x': 0, 'y': 0, 'width': 10, 'height': 20, 'total_width': 80, 'total_height': 100, 'image': 'nested/dir/spritesheet.png'},
      {'name': 'sprite2', 'x': 10, 'y': 20, 'width': 20, 'height': 30, 'total_width': 80, 'total_height': 100, 'image': 'nested/dir/spritesheet.png'},
      {'name': 'sprite3', 'x': 30, 'y': 50, 'width': 50, 'height': 50, 'total_width': 80, 'total_height': 100, 'image': 'nested/dir/( \'")/spritesheet.png'}
    ];
  });

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
