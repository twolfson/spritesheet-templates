function jsonTemplate(params) {
  // Convert items from an array into an object
  var items = params.items,
      itemObj = {};
  items.forEach(function (item) {
    // Grab the name and store the item under it
    var name = item.name;
    itemObj[name] = item;

    // Delete the name from the item
    delete item.name;
  });

  // Stringify the itemObj
  var retStr = orderedStringify(itemObj, null, 4);

  // Return the stringified JSON
  return retStr;
}

function orderedStringify(obj, replacer, spaces) {
  function addSpaces(spaces) {
    var r = "";
    for(var i=0; i<spaces; ++i) r += " ";
    return r;
  }

  return function ordStr(obj, replacer, currentSpace, spaces) {
    var t = typeof(obj),
        ret = "";

    if(t != "object" || obj === null) {
      if(t == "string") ret = '"' + obj + '"';
      else ret = obj;

      return String(ret);
    }

    var isArray = Array.isArray(obj),
        i, n;

    if(isArray) {
      for(i=0, n=obj.length; i<n; ++i) {
        ret += ordStr(obj[i], replacer, currentSpace+spaces);
      }
    }
    else {
      var keys = Object.keys(obj);
      keys.sort();
      for(i=0, n=keys.length; i<n; ++i) {
        ret += addSpaces(currentSpace+spaces);
        ret += '"' + keys[i] + '": ';
        ret += ordStr(obj[keys[i]], replacer, currentSpace+spaces);
        if(i<n-1) ret += ",\r\n";
      }
    }

    return (isArray ? "[" : "{") + "\r\n" + String(ret) + "\r\n" + addSpaces(currentSpace) + (isArray ? "]" : "}");

  }(obj, replacer, 0, spaces);
}

// Export our JSON template
module.exports = jsonTemplate;