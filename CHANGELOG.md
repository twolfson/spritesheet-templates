# json2css changelog
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
