var assert = require('assert'),
    fs = require('fs'),
    validateCss = require('css-validator'),
    json2css = require('../../');

exports.setupImages = function () {
  before(function () {
    // TODO: The malicious URL should be placed in a separate test but I want to test every engine and hate the bloat
    this.info = [
      {'name': 'sprite1', 'x': 0, 'y': 0, 'width': 10, 'height': 20, 'total_width': 80, 'total_height': 100, 'image': 'nested/dir/spritesheet.png'},
      {'name': 'sprite2', 'x': 10, 'y': 20, 'width': 20, 'height': 30, 'total_width': 80, 'total_height': 100, 'image': 'nested/dir/spritesheet.png'},
      {'name': 'sprite3', 'x': 30, 'y': 50, 'width': 50, 'height': 50, 'total_width': 80, 'total_height': 100, 'image': 'nested/dir/( \'")/spritesheet.png'}
    ];
  });
};

exports.runJson2Css = function () {
  before(function () {
    // Convert info into result via json2css
    var options = this.options,
        info = this.info,
        result = options ? json2css(info, options) : json2css(info);
    this.result = result;

    // If we are debugging, output results to a file
    if (process.env.TEST_DEBUG) {
      try { fs.mkdirSync(__dirname + '/../actual_files/'); } catch (e) {}
      fs.writeFileSync(__dirname + '/../actual_files/' + this.filename, result, 'utf8');
    }
  });
};

exports.assertMatchesAsExpected = function () {
  it('matches as expected', function () {
    // Load in the files and assert
    var actual = this.result,
        expected = fs.readFileSync(__dirname + '/../expected_files/' + this.filename, 'utf8');
    assert.strictEqual(actual, expected);
  });
};

exports._assertValidCss = function (css, done) {
  // Assert CSS exists
  assert.notEqual(css, '');

  // Assert it was fully valid via w3c
  validateCss(css, function (err, data) {
    assert.strictEqual(err, null);
    assert.deepEqual(data.errors, []);
    assert.deepEqual(data.warnings, []);
    done();
  });
};

exports.assertValidCss = function () {
  it('is valid CSS', function (done) {
    exports._assertValidCss(this.css, done);
  });
};