# spritesheet-templates [![Build status](https://travis-ci.org/twolfson/spritesheet-templates.svg?branch=master)](https://travis-ci.org/twolfson/spritesheet-templates)

Convert spritesheet data into CSS or CSS pre-processor data

`spritesheet-templates`, formerly `json2css`, was built as part of [`spritesmith`][], a tool that converts images into spritesheets and CSS variables.

[`spritesmith`]: https://github.com/Ensighten/spritesmith

## Getting Started
Install the module with: `npm install spritesheet-templates`

```js
// Compilation
var templater = require('spritesheet-templates');
templater({
  items: [{
    name: 'github', x: 0, y: 0, width: 10, height: 20
  }, {
    name: 'twitter', x: 10, y: 20, width: 20, height: 30
  }, {
    name: 'rss', x: 30, y: 50, width: 50, height: 50
  }],
  spritesheet: {
    width: 80, height: 100, image: 'url/path/to/spritesheet.png'
  }
}, {format: 'stylus'}); /*
// Result stylus
$github_x = 0px;
$github_y = 0px;
...
$github = 0px 0px 0px 0px 10px 20px 80px 100px 'url/path/to/spritesheet.png' 'github';
...
$twitter = 10px 20px -10px -20px 20px 30px 80px 100px 'url/path/to/spritesheet.png' 'twitter';
...
$rss = 30px 50px -30px -50px 50px 50px 80px 100px 'url/path/to/spritesheet.png' 'rss';
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
.github-logo {
  sprite($github);
}
*/
```

## Documentation
`spritesheet-templates` is exports the funciton `templater` as its `module.exports`.

#### `templater(params, options)`
Converter for spritesheet/sprite info into spritesheet

- params `Object` - Container for parameters
    - items `Object[]` - Array of objects with coordinate data about each sprite on the spritesheet
        - * `Object` - Container for sprite coordinate data
            - For reference, `*` symbolizes any index (e.g. `params.items[0]`)
            - name `String` - Name to use for the image
            - x `Number` - Horizontal coordinate of top-left corner of image
            - y `Number` - Vertical coordinate of top-left corner of image
            - width `Number` - Horizontal length of image in pixels
            - height `Number` - Vertical length of image in pixels
    - spritesheet `Object` - Information about spritesheet
        - width `Number` - Horizontal length of image in pixels
        - height `Number` - Vertical length of image in pixels
        - image `String` - URL to use for spritesheet
            - This will typically be used in `background-image`
            - For example, `background-image: url({{spritesheet.image}});`
- options `Object` - Optional settings
    - spritesheetName `String` - Prefix to use for all spritesheet variables
        - For example, `icons` will generate `$icons-width`/`$icons-image`/etc in a Stylus template
        - By default, this is `spritesheet` (e.g. `$spritesheet-width`, `$spritesheet-image`)
    - format `String` - Format to generate output in
        - We accept any format inside of the [Templates section](#templates)
            - Custom formats can be added via the [custom methods](#custom)
        - By default, we will use the `css` format
    - formatOpts `Mixed` - Options to pass through to the formatter

**Returns:**

- retVal `String` - Result from specified formatter

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
@sprite1-name: 'sprite1';
@sprite1-x: 0px;
@sprite1-y: 0px;
@sprite1-offset-x: 0px;
@sprite1-offset-y: 0px;
@sprite1-width: 10px;
@sprite1-height: 20px;
@sprite1-total-width: 80px;
@sprite1-total-height: 100px;
@sprite1-image: 'nested/dir/spritesheet.png';
@sprite1: 0px 0px 0px 0px 10px 20px 80px 100px 'nested/dir/spritesheet.png' 'sprite1';
@sprite2-name: 'sprite2';
// ...
```

[LESS]: http://lesscss.org/

#### `sass`
Output CSS variables as [SASS][] variables.

**Options:**

- functions `Boolean` - Flag to include mixins or not
    - By default this is `true` (mixins will be included)

**Example:**

```sass
$sprite1-name: 'sprite1'
$sprite1-x: 0px
$sprite1-y: 0px
$sprite1-offset-x: 0px
$sprite1-offset-y: 0px
$sprite1-width: 10px
$sprite1-height: 20px
$sprite1-total-width: 80px
$sprite1-total-height: 100px
$sprite1-image: 'nested/dir/spritesheet.png'
$sprite1: 0px 0px 0px 0px 10px 20px 80px 100px 'nested/dir/spritesheet.png' 'sprite1'
$sprite2-name: 'sprite2'
// ...
```

[SASS]: http://sass-lang.com/

#### `scss`
Output CSS variables as [SCSS][] variables.

**Options:**

- functions `Boolean` - Flag to include mixins or not
    - By default this is `true` (mixins will be included)

**Example:**

```scss
$sprite1-name: 'sprite1';
$sprite1-x: 0px;
$sprite1-y: 0px;
$sprite1-offset-x: 0px;
$sprite1-offset-y: 0px;
$sprite1-width: 10px;
$sprite1-height: 20px;
$sprite1-total-width: 80px;
$sprite1-total-height: 100px;
$sprite1-image: 'nested/dir/spritesheet.png';
$sprite1: 0px 0px 0px 0px 10px 20px 80px 100px 'nested/dir/spritesheet.png' 'sprite1';
$sprite2-name: 'sprite2';
// ...
```

[SCSS]: http://sass-lang.com/

#### `scss_maps`
Output CSS variables as [SCSS][] maps variables.

**Options:**

- functions `Boolean` - Flag to include mixins or not
    - By default this is `true` (mixins will be included)

**Example:**

```scss
$sprite1: (
  name: 'sprite1',
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

#### `stylus`
Output CSS variables as [Stylus][] variables.

**Options:**

- functions `Boolean` - Flag to include mixins or not
    - By default this is `true` (mixins will be included)

**Example:**

```scss
$sprite1_name = 'sprite1';
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
$sprite2_name = 'sprite2';
// ...
```

[Stylus]: http://learnboost.github.io/stylus/

#### Custom
Custom templates can be added dynamically via `templater.addTemplate` and `templater.addMustacheTemplate`.

##### Template data
The parameters passed into your template are known as `params`. These are a cloned copy of the `params` originally passed in. We add some normalized properties for your convenience.

- params `Object` - Container for parameters
    - items `Object[]` - Array of objects with coordinate data about each sprite on the spritesheet
        - * `Object` - Container for sprite coordinate data
            - For reference, `*` symbolizes any index (e.g. `params.items[0]`)
            - name `String` - Name to use for the image
            - x `Number` - Horizontal coordinate of top-left corner of image
            - y `Number` - Vertical coordinate of top-left corner of image
            - width `Number` - Horizontal length of image in pixels
            - height `Number` - Vertical length of image in pixels
            - total_width `Number` - Width of entire spritesheet
            - total_height `Number` - Height of entire spritesheet
            - image `String` - URL path to spritesheet
            - escaped_image `String` - URL encoded `image`
            - offset_x `Number` - Negative value of `x`. Useful to `background-position`
            - offset_y `Number` - Negative value of `y`. Useful to `background-position`
            - px `Object` - Container for numeric values including `px`
                - x `String` - `x` suffixed with `px`
                - y `String` - `y` suffixed with `px`
                - width `String` - `width` suffixed with `px`
                - height `String` - `height` suffixed with `px`
                - total_width `String` - `total_width` suffixed with `px`
                - total_height `String` - `total_height` suffixed with `px`
                - offset_x `String` - `offset_x` suffixed with `px`
                - offset_y `String` - `offset_y` suffixed with `px`
    - spritesheet `Object` - Information about spritesheet
        - width `Number` - Horizontal length of image in pixels
        - height `Number` - Vertical length of image in pixels
        - image `String` - URL to use for spritesheet
            - This will typically be used in `background-image`
            - For example, `background-image: url({{spritesheet.image}});`
        - escaped_image `String` - URL encoded `image`
        - px `Object` container for numeric values including `px`
            - width `String` - `width` suffixed with `px`
            - height `String` - `height` suffixed with `px`
    - spritesheet_name `String` - Name for spritesheet
    - options `Mixed` - Options to passed through via `options.formatOpts`

##### `templater.addTemplate(name, fn)`
Method to define a custom template under the format of `name`.

- name `String` - Key to store template under for reference via `options.format`
- fn `Function` - Template function
    - Should have signature of `function (params)` and return a `String` output

##### `templater.addMustacheTemplate(name, tmplStr)`
Method to define a custom mustache template under the format of `name`.

- name `String` - Key to store template under for reference via `options.format`
- tmplStr `String` - Mustache template to use for formatting
    - This will receive `params` as its `data` (e.g. `{{items}}` is `params.items`)

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via `npm run lint` and test via `npm test`.

## Donating
Support this project and [others by twolfson][gratipay] via [gratipay][].

[![Support via Gratipay][gratipay-badge]][gratipay]

[gratipay-badge]: https://cdn.rawgit.com/gratipay/gratipay-badge/2.x.x/dist/gratipay.png
[gratipay]: https://www.gratipay.com/twolfson/

## Unlicense
As of Sep 08 2013, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE

Prior to Sep 08 2013, this repository and its contents were licensed under the [MIT license][].

[MIT license]: https://github.com/twolfson/spritesheet-templates/blob/e601307209b75faa48cb65388a17e0047b561aa0/LICENSE-MIT
