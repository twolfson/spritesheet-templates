var assert = require('assert'),
    validateCss = require('css-validator'),
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
});
