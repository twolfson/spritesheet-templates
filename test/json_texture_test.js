var assert = require('assert');
var configUtils = require('./utils/config');
var testUtils = require('./utils/test');
var fs = require('fs');
var pkg = require('../package.json');

describe('A hash map of texture info, similar to TexturePacker', function () {
  testUtils.setInfo(configUtils.multipleSprites);

  function assertValidJson() {
    it('is valid JSON', function () {
      var result = this.result;
      assert.doesNotThrow(function () {
        JSON.parse(result);
      });
    });
  }

  describe('processed by `spritesheet-templates` into JSON', function () {
    testUtils.runTemplater({format: 'json_texture'});

    var expected = fs.readFileSync(__dirname + '/expected_files/json_texture.json', 'utf8');
    expected = expected.replace('__VERSION__', pkg.version);
    testUtils.assertOutputMatchesString(expected);

    assertValidJson();
  });
});
