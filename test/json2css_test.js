var assert = require('assert'),
    exec = require('child_process').exec,
    validateCss = require('css-validator'),
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

  function assertValidJson() {
    it('is valid JSON', function () {
      var result = this.result;
      assert.doesNotThrow(function () {
        JSON.parse(result);
      });
    });
  }
  describe('processed by `json2css` into JSON', function () {
    before(function () {
      this.options = {'format': 'json'};
      this.filename = 'json.json';
    });
    utils.runJson2Css();

    utils.assertMatchesAsExpected();
    assertValidJson();
  });
  describe('processed by `json2css` into an array', function () {
    before(function () {
      this.options = {'format': 'jsonArray'};
      this.filename = 'jsonArray.json';
    });
    utils.runJson2Css();

    utils.assertMatchesAsExpected();
    assertValidJson();
  });

  describe('processed by `json2css` into CSS', function () {
    before(function () {
      this.options = null;
      this.filename = 'css.css';
    });
    utils.runJson2Css();

    utils.assertMatchesAsExpected();
    it('is valid CSS', function (done) {
      // Add some stylus which hooks into our result
      var css = this.result;

      // Assert CSS exists
      assert.notEqual(css, '');

      // Assert it was fully valid via w3c
      validateCss(css, function (err, data) {
        assert.strictEqual(err, null);
        assert.deepEqual(data.errors, []);
        assert.deepEqual(data.warnings, []);
        done();
      });
    });
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

      // Render the SASS, assert no errors, and valid CSS
      var tmp = new Tempfile();
      tmp.writeFileSync(scssStr);
      this.tmp = tmp;
    });
    after(function () {
      this.tmp.unlinkSync();
    });

    utils.assertMatchesAsExpected();
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
