var assert = require('assert'),
    utils = require('./utils');

describe('An array of image positions, dimensions, and names', function () {
  utils.setupImages();

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
