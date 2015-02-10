# spritesheet-templates changelog
8.2.1 - Corrected CSS sprite example. Fixes Ensighten/grunt-spritesmith#112

8.2.0 - Added `spritesheetName` option, `spritesheet.px`/`spritesheet_name` variables for formatters, and a bunch of spritesheet/sprites variables to preprocessor templates

8.1.0 - Added `spritesheet.escaped_image` to match `item.escaped_image` property

8.0.0 - Moved to `params` as input and requiring spritesheet information

7.2.0 - Moved to more maintainable pattern in code

7.1.1 - Removed unused `grunt` dependencies

7.1.0 - Added `twolfson-style` for consistent styling and linting

7.0.2 - Fixed missing link in README

7.0.1 - Updated README info

7.0.0 - Renamed from `json2css` to `spritesheet-templates` to focus on functionality

6.1.0 - Removed HTML escaping of CSS selectors. Fixes Ensighten/grunt-spritesmith#104

6.0.0 - Renamed `cssClass` option to `cssSelector`

5.2.2 - Added documentation and example for each template flavor

5.2.1 - Updated Travis CI badge via @shinn in #32

5.2.0 - Added comments explaining how to use each template

5.1.1 - Fixed broken tests due to indentation changes

5.1.0 - Fixed indentation and options for LESS, SCSS, and `scss_maps` templates

5.0.0 - Moved `scss_maps` template from map of all sprites to map variable per sprite. Fixes #29

4.4.1 - Fixed broken `sassc` compilation in Travis CI. Fixes #28

4.4.0 - Updated `scss_maps` template to use height for height via @makeable in #26

4.3.0 - Added `scss_maps` template via @leevigraham in #24

4.2.2 - Add `eight-track` to CSS validation to remove third party dependency

4.2.1 - Added CSS validation to test suite

4.2.0 - Moved to mocha, patched regression for SCSS + libsass

4.1.1 - Added .travis.yml

4.1.0 - Added jsonArray template

4.0.0 - Deprecated object as input. Now only accepting arrays.

3.2.0 - Added `total_width` and `total_height` properties

3.1.0 - Moved all templates to `escaped_image` to allow for safely escaped and some quote-free URLs

3.0.0 - Moved `css` as the default engine

Before 3.0.0 - See commit logs
