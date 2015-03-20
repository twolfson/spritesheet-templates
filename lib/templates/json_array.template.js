function jsonArrayTemplate(params) {
  // Stringify the array of sprites
  var sprites = params.sprites;
  var retStr = JSON.stringify(sprites, null, 4);

  // Return the stringified JSON
  return retStr;
}

// Export our JSON template
module.exports = jsonArrayTemplate;
