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
    var obj = {};
      // when converted to json
      var json = json2css(obj);
        // matches as expected
        test.equal(json, '{}');

      // when converted to Stylus
        // matches as expected
    test.done();
  }
};
