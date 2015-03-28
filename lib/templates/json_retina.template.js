function retinaJsonTemplate(data) {
  // Convert retina groups from an array into an object
  var retinaGroups = data.retina_groups;
  var retinaObj = {};
  retinaGroups.forEach(function (retinaGroup) {
    // Grab the name and store the sprite under it
    var name = retinaGroup.name;
    retinaObj[name] = retinaGroup;

    // Delete the name from the group and its sprites
    delete retinaGroup.name;
    delete retinaGroup.index;
    delete retinaGroup.normal.name;
    delete retinaGroup.retina.name;
  });

  // Stringify the retinaObj
  var retStr = JSON.stringify(retinaObj, null, 4);

  // Return the stringified JSON
  return retStr;
}

// Export our JSON template
module.exports = retinaJsonTemplate;
