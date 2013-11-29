var assert = require('assert'),
    exec = require('child_process').exec,
    Tempfile = require('temporary/lib/file'),
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

      // Render the SASS, assert no errors, and valid CSS
      var tmp = new Tempfile();
      tmp.writeFileSync(sassStr);
      this.tmp = tmp;
    });
    after(function () {
      this.tmp.unlinkSync();
    });

    utils.assertMatchesAsExpected();
    it('is valid SASS', function (done) {
      exec('sass ' + this.tmp.path, function (err, css, stderr) {
        assert.strictEqual(stderr, '');
        assert.strictEqual(err, null);
        assert.notEqual(css, '');
        // console.log('SASS', css);
        done(err);
      });
    });
  });
});
