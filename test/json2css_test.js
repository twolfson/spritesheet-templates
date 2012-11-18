var json2css = require('../lib/json2css.js'),
    fs = require('fs'),
    expectedDir = __dirname + '/expected_files';

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
    test.expect(2);

    // A basic object
    var obj = [
          {'name': 'sprite1', 'x': 0, 'y': 0, 'width': 10, 'height': 20},
          {'name': 'sprite2', 'x': 10, 'y': 20, 'width': 20, 'height': 30},
          {'name': 'sprite3', 'x': 30, 'y': 50, 'width': 50, 'height': 50}
        ];
      // when converted
      var json = json2css(obj),
          expectedJSON = fs.readFileSync(expectedDir + '/json.json', 'utf8');
        // matches expected json
        test.equal(json, expectedJSON);

      // when converted to Stylus
      var stylus = json2css(obj, {'format': 'stylus'}),
          expectedStylus = fs.readFileSync(expectedDir + '/stylus.styl', 'utf8');
        // matches as expected
        test.equal(stylus, expectedStylus, 'A basic object when converted to Stylus matches as expected');

    test.done();
  }
};
