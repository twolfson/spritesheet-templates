var assert = require('assert'),
    validateCss = require('css-validator'),
    utils = require('./utils');

describe('An array of image positions, dimensions, and names', function () {
  utils.setupImages();

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
