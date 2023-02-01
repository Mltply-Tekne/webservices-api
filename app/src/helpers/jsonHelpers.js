function groupJson(json, key) {
    grouped = json.reduce(function (r, a) {

        remainingValues = Object.assign({}, a)
        delete remainingValues[key]
    
        r[a[key]] = r[a[key]] || [];
        r[a[key]].push(remainingValues);
    
        return r;
    }, Object.create(null));

    return grouped
}

function arrayToKey(array, value, key) {

    if (key == undefined) {
        key = 'instanda_key'
    }
 
    var result = array.reduce(function(r, e) {
        r[e[key]] = e[value];
        return r;
    }, {});

    return result
}

function parseDates(resBody) {

    function reviver(key, value) {
        const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    
      if (typeof value === "string" && dateFormat.test(value)) {
        return new Date(value);
      }
    
      return value;
    }
    return JSON.parse(JSON.stringify((resBody)), reviver);
}


module.exports = {groupJson, arrayToKey, parseDates}