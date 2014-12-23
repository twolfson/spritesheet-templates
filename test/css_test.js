var utils = require('./utils');

describe('An array of image positions, dimensions, and names', function () {
  utils.setupImages();

  describe('processed by `spritesheet-templates` into CSS', function () {
    before(function () {
      this.options = null;
      this.filename = 'css.css';
    });
    utils.runTemplater();

    utils.assertMatchesAsExpected();
    utils.runFakeJigsaw();
    it('is valid CSS', function (done) {
      var css = this.result;
      utils._assertValidCss(css, done);
    });
  });
});

// Edge case test for filepaths with quotes
describe('An array of image positions, dimensions, and names', function () {
  utils.setupImages({
    spritesheet: {
      width: 80, height: 100, image: 'nested/dir/( \'")/spritesheet.png'
    }
  });

  describe('processed by `spritesheet-templates` into CSS with an escapable selector', function () {
    before(function () {
      this.options = null;
      this.filename = 'css-quote-filepath.css';
    });
    utils.runTemplater();

    utils.assertMatchesAsExpected();
    utils.runFakeJigsaw();
    it('is valid CSS', function (done) {
      var css = this.result;
      utils._assertValidCss(css, done);
    });
  });
});

// Edge case test for https://github.com/Ensighten/grunt-spritesmith/issues/104
describe('An array of image positions, dimensions, and names', function () {
  utils.setupImages();
  describe('processed by `spritesheet-templates` into CSS with an escapable selector', function () {
    before(function () {
      this.options = {
        formatOpts: {
          cssSelector: function (item) {
            return '.hello > .icon-' + item.name;
          }
        }
      };
      this.filename = 'css-html-selector.css';
    });
    utils.runTemplater();

    utils.assertMatchesAsExpected();
    utils.runFakeJigsaw();
    it('is valid CSS', function (done) {
      var css = this.result;
      utils._assertValidCss(css, done);
    });
  });
});
