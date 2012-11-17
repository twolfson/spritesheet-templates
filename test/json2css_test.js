var json2css = require('../lib/json2css.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['json2css'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'json': function(test) {
    test.expect(1);

    // A basic object
    var obj = {
          'sprite1': {'x': 0, 'y': 0, 'width': 10, 'height': 20},
          'sprite2': {'x': 10, 'y': 20, 'width': 20, 'height': 30},
          'sprite3': {'x': 30, 'y': 50, 'width': 50, 'height': 50}
        };
      // // when converted to json
      // var json = json2css(obj);
      //   // matches as expected
      //   test.equal(json, '{}');

      // when converted to Stylus
      var stylus = json2css(obj, {'format': 'stylus'}),
          expectedStylus = require('./expected_files/stylus.styl', 'utf8');
        // matches as expected
        test.equal(stylus, expectedStylus, 'A basic object when converted to Stylus matches as expected');

    test.done();
  }
};
