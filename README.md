# json2css [![Build status](https://travis-ci.org/twolfson/json2css.svg?branch=master)](https://travis-ci.org/twolfson/json2css)

Convert JSON into pre-processor ready CSS.

This was initially designed for generating coordinates for a mapping of sprites on a spritesheet. However, it should be usable for anything related to dimensions/positions and CSS.

## Getting Started
Install the module with: `npm install json2css`

```js
// Compilation
var json2css = require('json2css'),
    obj = [
      {'name': 'github', 'x': 0, 'y': 0, 'width': 10, 'height': 20, 'total_width': 80, 'total_height': 100, 'image': 'spritesheet.png'},
      {'name': 'twitter', 'x': 10, 'y': 20, 'width': 20, 'height': 30, 'total_width': 80, 'total_height': 100, 'image': 'spritesheet.png'},
      {'name': 'rss', 'x': 30, 'y': 50, 'width': 50, 'height': 50, 'image': 'spritesheet.png'}
    ],
    stylus = json2css(obj, {'format': 'stylus'});

// Result (stylus)
$github_x = 0px;
$github_y = 0px;
...
$github = 0px 0px 0px 0px 10px 20px 80px 100px 'spritesheet.png';
...
$twitter = 10px 20px -10px -20px 20px 30px 80px 100px 'spritesheet.png';
...
$rss = 30px 50px -30px -50px 50px 50px 80px 100px 'spritesheet.png';
...
spriteWidth($sprite) {
  width: $sprite[0];
}
...
sprite($sprite) {
  spriteImage($sprite)
  spritePosition($sprite)
  spriteWidth($sprite)
  spriteHeight($sprite)
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
 * @param {Object[]} input Object to convert into CSS
 * @param {String} input[*].name Name to use for the image
 * @param {Number} input[*].x Horizontal coordinate of top-left corner of image
 * @param {Number} input[*].y Vertical coordinate of top-left corner of image
 * @param {Number} input[*].width Horizontal length of image
 * @param {Number} input[*].height Vertical length of image
 * @param {Number} input[*].total_width Horizontal length of spritesheet
 * @param {Number} input[*].total_height Vertical length of spritesheet
 * @param {Number} input[*].image Path to image itself (used as a URL component)
 * @param {Object} [options] Options to convert JSON with
 * @param {String} [options.format="css"] Format to output json in
 *   Format options can be found in the Templates section
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

### Templates
These are the various template options for `options.format`:

#### `css`
Ouput CSS variables as CSS rules.

**Options:**

- cssSelector `Function` - Override mapping for CSS selector
    - `cssSelector` should have signature `function (item) { return 'selector'; }`
    - By default this will return `'.icon-' + item.name`
    - It will receive `item` with all parameters designed for template

**Example:**

```css
.icon-sprite1 {
  background-image: url(nested/dir/spritesheet.png);
  background-position: 0px 0px;
  width: 10px;
  height: 20px;
}
.icon-sprite2 {
/* ... */
```

#### `json`
Output CSS variables in JSON format.

**Example:**

```js
{
    "sprite1": {
        "x": 0,
        "y": 0,
        "width": 10,
        "height": 20,
        "total_width": 80,
        "total_height": 100,
        "image": "nested/dir/spritesheet.png",
        "offset_x": 0,
        "offset_y": 0,
        "px": {
            "x": "0px",
            "y": "0px",
            "offset_x": "0px",
            "offset_y": "0px",
            "height": "20px",
            "width": "10px",
            "total_height": "100px",
            "total_width": "80px"
        },
        "escaped_image": "nested/dir/spritesheet.png"
    },
    "sprite2": {
    // ...
```

#### `json_array`
Output CSS variables as an array of objects.

**Example:**

```js
[
    {
        "name": "sprite1",
        "x": 0,
        "y": 0,
        "width": 10,
        "height": 20,
        "total_width": 80,
        "total_height": 100,
        "image": "nested/dir/spritesheet.png",
        "offset_x": 0,
        "offset_y": 0,
        "px": {
            "x": "0px",
            "y": "0px",
            "offset_x": "0px",
            "offset_y": "0px",
            "height": "20px",
            "width": "10px",
            "total_height": "100px",
            "total_width": "80px"
        },
        "escaped_image": "nested/dir/spritesheet.png"
    },
    {
        "name": "sprite2",
        // ...
```

#### `less`
Output CSS variables as [LESS][] variables.

**Options:**

- functions `Boolean` - Flag to include mixins or not
    - By default this is `true` (mixins will be included)

**Example:**

```less
@sprite1-x: 0px;
@sprite1-y: 0px;
@sprite1-offset-x: 0px;
@sprite1-offset-y: 0px;
@sprite1-width: 10px;
@sprite1-height: 20px;
@sprite1-total-width: 80px;
@sprite1-total-height: 100px;
@sprite1-image: 'nested/dir/spritesheet.png';
@sprite1: 0px 0px 0px 0px 10px 20px 80px 100px 'nested/dir/spritesheet.png';
@sprite2-x: 10px;
// ...
```

[LESS]: http://lesscss.org/

### `sass`
Output CSS variables as [SASS][] variables.

**Options:**

- functions `Boolean` - Flag to include mixins or not
    - By default this is `true` (mixins will be included)

**Example:**

```sass
$sprite1-x: 0px
$sprite1-y: 0px
$sprite1-offset-x: 0px
$sprite1-offset-y: 0px
$sprite1-width: 10px
$sprite1-height: 20px
$sprite1-total-width: 80px
$sprite1-total-height: 100px
$sprite1-image: 'nested/dir/spritesheet.png'
$sprite1: 0px 0px 0px 0px 10px 20px 80px 100px 'nested/dir/spritesheet.png'
$sprite2-x: 10px
// ...
```

[SASS]: http://sass-lang.com/

### `scss`
Output CSS variables as [SCSS][] variables.

**Options:**

- functions `Boolean` - Flag to include mixins or not
    - By default this is `true` (mixins will be included)

**Example:**

```scss
$sprite1-x: 0px;
$sprite1-y: 0px;
$sprite1-offset-x: 0px;
$sprite1-offset-y: 0px;
$sprite1-width: 10px;
$sprite1-height: 20px;
$sprite1-total-width: 80px;
$sprite1-total-height: 100px;
$sprite1-image: 'nested/dir/spritesheet.png';
$sprite1: 0px 0px 0px 0px 10px 20px 80px 100px 'nested/dir/spritesheet.png';
$sprite2-x: 10px;
// ...
```

[SCSS]: http://sass-lang.com/

### `scss_maps`
Output CSS variables as [SCSS][] maps variables.

**Options:**

- functions `Boolean` - Flag to include mixins or not
    - By default this is `true` (mixins will be included)

**Example:**

```scss
$sprite1: (
  x: 0px,
  y: 0px,
  offset_x: 0px,
  offset_y: 0px,
  width: 10px,
  height: 20px,
  total_width: 80px,
  total_height: 100px,
  image: 'nested/dir/spritesheet.png'
);
$sprite2: (
// ...
```

### `stylus`
Output CSS variables as [Stylus][] variables.

**Options:**

- functions `Boolean` - Flag to include mixins or not
    - By default this is `true` (mixins will be included)

**Example:**

```scss
$sprite1_x = 0px;
$sprite1_y = 0px;
$sprite1_offset_x = 0px;
$sprite1_offset_y = 0px;
$sprite1_width = 10px;
$sprite1_height = 20px;
$sprite1_total_width = 80px;
$sprite1_total_height = 100px;
$sprite1_image = 'nested/dir/spritesheet.png';
$sprite1 = 0px 0px 0px 0px 10px 20px 80px 100px 'nested/dir/spritesheet.png';
$sprite2_x = 10px;
// ...
```

[Stylus]: http://learnboost.github.io/stylus/

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via [grunt](https://github.com/cowboy/grunt) and test via `npm test`.

## Donating
Support this project and [others by twolfson][gittip] via [gittip][].

[![Support via Gittip][gittip-badge]][gittip]

[gittip-badge]: https://rawgithub.com/twolfson/gittip-badge/master/dist/gittip.png
[gittip]: https://www.gittip.com/twolfson/

## Unlicense
As of Sep 08 2013, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE

Prior to Sep 08 2013, this repository and its contents were licensed under the [MIT license][].

[MIT license]: https://github.com/twolfson/json2css/blob/e601307209b75faa48cb65388a17e0047b561aa0/LICENSE-MIT
