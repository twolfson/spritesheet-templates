path = require("path");

function jsonTextureTemplate(data) {
  var spriteObj = {};

  // Create frame data for each sprite.
  spriteObj.frames={};

  data.sprites.forEach(function (sprite) {
    var entry={
      frame: {
        "x": sprite.x,
        "y": sprite.y,
        "w": sprite.width,
        "h": sprite.height
      }
    };

    spriteObj.frames[path.basename(sprite.source_image)]=entry;
  });

  // Create the meta data.
  spriteObj.meta = {
    "app": "spritesheet-templates",
    "version": "9.5.0",
    "image": path.basename(data.spritesheet.image),
    "format": "RGBA8888",
    "scale": 1,
    "size": {
      "w": data.spritesheet.width,
      "h": data.spritesheet.height
    }
  };

  // Stringify the spriteObj
  var retStr = JSON.stringify(spriteObj, null, 4);

  // Return the stringified JSON
  return retStr;
}

// Export our JSON texture template
module.exports = jsonTextureTemplate;
