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
  'processed via json2css': function () {
    // Convert info into result via json2css
    var options = this.options,
        info = this.info,
        result = options ? json2css(info, options) : json2css(info);
    this.result = result;
  },
  'matches as expected': function () {
    // Load in the files and assert
    var actual = this.result,
        expected = fs.readFileSync(expectedDir  + '/' + this.filename, 'utf8');
    assert.strictEqual(actual, expected);
  },

  // JSON
  'processed into JSON': [function () {
    // No options specified for JSOn
    this.filename = 'json.json';
  }, 'processed via json2css'],
  'is valid JSON': function () {
  },

  // Stylus
  'processed into Stylus': [function () {
    this.options = {'format': 'stylus'};
    this.filename = 'stylus.styl';
  }, 'processed via json2css'],
  'is valid Stylus': function () {
  },

  // LESS
  'processed into LESS': [function () {
    this.options = {'format': 'less'};
    this.filename = 'less.less';
  }, 'processed via json2css'],
  'is valid LESS': function () {
  },

  // SASS
  'processed into SASS': [function () {
    this.options = {'format': 'sass'};
    this.filename = 'sass.sass';
  }, 'processed via json2css'],
  'is valid SASS': function () {
  },

  // SCSS
  'processed into SCSS': [function () {
    this.options = {'format': 'scss'};
    this.filename = 'scss.scss';
  }, 'processed via json2css'],
  'is valid SCSS': function () {
  }
};