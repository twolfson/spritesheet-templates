# json2css

Convert JSON into pre-processor ready CSS

## Getting Started
Install the module with: `npm install json2css`

```javascript
// Compilation
var json2css = require('json2css'),
    obj = [
      {'name': 'github', 'x': 0, 'y': 0, 'width': 10, 'height': 20},
      {'name': 'twitter', 'x': 10, 'y': 20, 'width': 20, 'height': 30},
      {'name': 'rss', 'x': 30, 'y': 50, 'width': 50, 'height': 50}
    ],
    stylus = json2css(obj, {'format': 'stylus'});

// Result (stylus)
$github_x = 0px;
$github_y = 0px;
...
$github = 0px 0px 0px 0px 10px 20px;
...
$twitter = 10px 20px -10px -20px 20px 30px;
...
$rss = 30px 50px -30px -50px 50px 50px;
...
spriteX($sprite) {
  return $sprite[0];
}
...
sprite($sprite) {
  background-image: url(spriteBackground());
  background-position: spriteOffsetX($sprite) spriteOffsetY($sprite);
  width: spriteWidth($sprite);
  height: spriteHeight($sprite);
}

// Inside of your Stylus
.githubLogo {
  sprite($github);
}
```

## Documentation
json2css is a single function repo
```js
/**
 * @param {Object|Object[]} input Object to convert into CSS
 * @param {Object} [options] Options to convert JSON with
 * @param {String} [options.format=json] Format to output json in (Available: json, less, sass, scss, stylus)
 * @param {Mixed} [options.formatOpts={}] Options to pass through to the formatter
 */
```

New templates can be added dynamically via
```js
// Processes template via function
json2css.addTemplate(name, fn);

// Processes template via mustache
json2css.addMustacheTemplate(name, tmplStr);
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

## License
Copyright (c) 2012 Todd Wolfson
Licensed under the MIT license.
