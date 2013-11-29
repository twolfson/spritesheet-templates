var assert = require('assert'),
    fs = require('fs'),
    json2css = require('../../');

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