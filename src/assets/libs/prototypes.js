function Copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function Filter(obj, predicate) {
    return Object.keys(obj)
    .filter( key => predicate(obj[key]) )
    .reduce( (res, key) => (res[key] = obj[key], res), {} );
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