var assert = require('assert'),
    fs = require('fs'),
    json2css = require('../lib/json2css.js'),
    expectedDir = __dirname + '/expected_files';

module.exports = {
  // Common setup/assertion
  'An array of image positions, dimensions, and names': function () {
    this.info = [
      {'name': 'sprite1', 'x': 0, 'y': 0, 'width': 10, 'height': 20},
      {'name': 'sprite2', 'x': 10, 'y': 20, 'width': 20, 'height': 30},
      {'name': 'sprite3', 'x': 30, 'y': 50, 'width': 50, 'height': 50}
    ];
  },
  'matches as expected': function () {
    // Load in the files and assert
    var actual = this.result,
        expected = fs.readFileSync(expectedDir  + '/' + this.filename, 'utf8');
    assert.strictEqual(actual, expected);
  },

  // JSON
  'processed into JSON': function () {
  },
  'is valid JSON': function () {
  },

  // Stylus
  'processed into Stylus': function () {
  },
  'is valid Stylus': function () {
  },

  // LESS
  'processed into LESS': function () {
  },
  'is valid LESS': function () {
  },

  // SASS
  'processed into SASS': function () {
  },
  'is valid SASS': function () {
  },

  // SCSS
  'processed into SCSS': function () {
  },
  'is valid SCSS': function () {
  }
};