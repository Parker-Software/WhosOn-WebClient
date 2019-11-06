function Copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function Filter(obj, predicate) {
    return Object.keys(obj)
    .filter( key => predicate(obj[key]) )
    .reduce( (res, key) => (res[key] = obj[key], res), {} );
}

function Find(obj, predicate) {
    var key = Object.keys(obj)
    .find(key => predicate(obj[key]));

    return obj[key];
}

function YNToBool(variable) {
    return variable == "Y" ? true : false;
}


function getDate(timeStamp)
{
    var h = (timeStamp.getHours() < 10 ? '0' : '') + timeStamp.getHours();
    var m = (timeStamp.getMinutes() < 10 ? '0' : '') + timeStamp.getMinutes();
    var s = (timeStamp.getSeconds() < 10 ? '0' : '') + timeStamp.getSeconds();

    return h + ':' + m + ':' + s;
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


function cannedResponsesToTree(data) {
    var tree = {};
    Object.keys(data).forEach(x => {
        var response = data[x];
        response.children = [];

        if(response.ParentID != 0) {
            data[response.ParentID].children.push(response);
        } else {
            tree[response.ID] = response;
        }
    });

    return tree;
}

if(Element.prototype.scrollBy == null) {
    Element.prototype.scrollBy = function(options) {
        this.scrollLeft = this.scrollLeft + options.left;
        this.scrollTop = this.scrollTop + options.top;
    };
} 