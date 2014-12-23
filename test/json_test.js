var assert = require('assert');
var utils = require('./utils');

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
  describe('processed by `spritesheet-templates` into JSON', function () {
    before(function () {
      this.options = {format: 'json'};
      this.filename = 'json.json';
    });
    utils.runTemplater();

    utils.assertMatchesAsExpected();
    assertValidJson();
  });
  describe('processed by `spritesheet-templates` into an array', function () {
    before(function () {
      this.options = {format: 'jsonArray'};
      this.filename = 'jsonArray.json';
    });
    utils.runTemplater();

    utils.assertMatchesAsExpected();
    assertValidJson();
  });
});
