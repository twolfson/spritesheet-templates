var assert = require('assert'),
    fs = require('fs'),
    exec = require('child_process').exec,
    Tempfile = require('temporary/lib/file'),
    json2css = require('../lib/json2css.js'),
    expectedDir = __dirname + '/expected_files';

function processedViaJson2Css() {
  before(function () {
    // Convert info into result via json2css
    var options = this.options,
        info = this.info,
        result = options ? json2css(info, options) : json2css(info);
    this.result = result;

    // If we are debugging, output results to a file
    if (process.env.TEST_DEBUG) {
      try { fs.mkdirSync(__dirname + '/actual_files/'); } catch (e) {}
      fs.writeFileSync(__dirname + '/actual_files/' + this.filename, result, 'utf8');
    }
  });
}

function itMatchesAsExpected() {
  it('matches as expected', function () {
    // Load in the files and assert
    var actual = this.result,
        expected = fs.readFileSync(expectedDir  + '/' + this.filename, 'utf8');
    assert.strictEqual(actual, expected);
  });
}

function itIsValidJson() {
  it('is valid JSON', function () {
    var result = this.result;
    assert.doesNotThrow(function () {
      JSON.parse(result);
    });
  });
}

describe('An array of image positions, dimensions, and names', function () {
  before(function () {
    // TODO: The malicious URL should be placed in a separate test but I want to test every engine and hate the bloat
    this.info = [
      {'name': 'sprite1', 'x': 0, 'y': 0, 'width': 10, 'height': 20, 'total_width': 80, 'total_height': 100, 'image': 'nested/dir/spritesheet.png'},
      {'name': 'sprite2', 'x': 10, 'y': 20, 'width': 20, 'height': 30, 'total_width': 80, 'total_height': 100, 'image': 'nested/dir/spritesheet.png'},
      {'name': 'sprite3', 'x': 30, 'y': 50, 'width': 50, 'height': 50, 'total_width': 80, 'total_height': 100, 'image': 'nested/dir/( \'")/spritesheet.png'}
    ];
  });

  describe('processed into JSON', function () {
    before(function () {
      this.options = {'format': 'json'};
      this.filename = 'json.json';
    });
    processedViaJson2Css();

    itMatchesAsExpected();
    itIsValidJson();
  });

  describe('processed into an array', function () {
    before(function () {
      this.options = {'format': 'jsonArray'};
      this.filename = 'jsonArray.json';
    });
    processedViaJson2Css();

    itMatchesAsExpected();
    itIsValidJson();
  });

  describe('processed into CSS', function () {
    before(function () {
      this.options = null;
      this.filename = 'css.css';
    });
    processedViaJson2Css();

    itMatchesAsExpected();
    it('is valid CSS', function () {
      // Add some stylus which hooks into our result
      var css = this.result;

      // Assert no errors and validity of CSS
      assert.notEqual(css, '');

      // TODO: Validate CSS
      // console.log('CSS', css);
    });
  });

  describe('processed into Stylus', function () {
    before(function () {
      this.options = {'format': 'stylus'};
      this.filename = 'stylus.styl';
    });
    processedViaJson2Css();

    itMatchesAsExpected();
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

  describe('processed into LESS', function () {
    before(function () {
      this.options = {'format': 'less'};
      this.filename = 'less.less';
    });
    processedViaJson2Css();

    itMatchesAsExpected();
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

  describe('processed into SASS', function () {
    before(function () {
      this.options = {'format': 'sass'};
      this.filename = 'sass.sass';
    });
    processedViaJson2Css();
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

    itMatchesAsExpected();
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

  describe('processed into SCSS', function () {
    before(function () {
      this.options = {'format': 'scss'};
      this.filename = 'scss.scss';
    });
    processedViaJson2Css();

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

      // Render the SASS, assert no errors, and valid CSS
      var tmp = new Tempfile();
      tmp.writeFileSync(scssStr);
      this.tmp = tmp;
    });
    after(function () {
      this.tmp.unlinkSync();
    });

    itMatchesAsExpected();
    it('is valid SCSS (ruby)', function (done) {
      exec('sass --scss ' + this.tmp.path, function (err, css, stderr) {
        assert.strictEqual(stderr, '');
        assert.strictEqual(err, null);
        assert.notEqual(css, '');
        // console.log('SCSS', css);
        done(err);
      });
    });

    it('is valid SCSS (libsass)', function (done) {
      exec('sassc ' + this.tmp.path, function (err, css, stderr) {
        assert.strictEqual(stderr, '');
        assert.strictEqual(err, null);
        assert.notEqual(css, '');
        // console.log('SCSS', css);
        done(err);
      });
    });
  });
});
