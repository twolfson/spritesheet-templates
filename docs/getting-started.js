var templater = require('../');
var obj = [{
  name: 'github', x: 0, y: 0, width: 10, height: 20,
  total_width: 80, total_height: 100, image: 'spritesheet.png'
}, {
  name: 'twitter', x: 10, y: 20, width: 20, height: 30,
  total_width: 80, total_height: 100, image: 'spritesheet.png'
}, {
  name: 'rss', x: 30, y: 50, width: 50, height: 50,
  total_width: 80, total_height: 100, image: 'spritesheet.png'
}];
var stylus = templater(obj, {format: 'stylus'});

console.log(stylus);
