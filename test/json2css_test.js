var assert = require('assert'),
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
    utils.runFakeJigsaw();
    it('is valid CSS', function (done) {
      var css = this.result;
      utils._assertValidCss(css, done);
    });
  });
});
