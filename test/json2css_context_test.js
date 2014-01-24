var assert = require('assert'),
    fs = require('fs'),
    json2css = require('../'),
    utils = require('./utils');

describe('Check context is found in output.', function () {
  utils.setupImages();

  describe('Check context vars are found in output.css', function () {
    before(function () {
      this.options = {
        format: 'test-context',
      };
      this.filename = 'context.css';
      this.context = {'foo': 'bar', 'bar': 'baz'};
      json2css.addMustacheTemplate('test-context', fs.readFileSync(__dirname + '/test_files/context.mustache', 'utf8'));
    });
    utils.runJson2Css();
    utils.assertMatchesAsExpected();
  });
});
