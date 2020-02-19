
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

function IniExtraction(ini) {
    var split = ini.split("=");

    if(split.length > 1) {
        if(split[1].trim() == "True" || split[1].trim() == "true") {split[1] = true;}
        else if(split[1].trim() == "False" || split[1].trim() == "false") {split[1] = false;}
        else if(!isNaN(split[1])) {
            split[1] = Number(split[1]);
        }
        else {
            split[1] = split[1].trim();
        }
    } else {
        throw "Not Valid Ini";
    }
    return split;
}

function isVisible(elem) {
    if(elem == null) return false;
    if (!(elem instanceof Element)) throw Error('DomUtil: elem is not an element.');
    const style = getComputedStyle(elem);
    if (style.display === 'none') return false;
    if (style.visibility !== 'visible') return false;
    if (style.opacity < 0.1) return false;
    if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
        elem.getBoundingClientRect().width === 0) {
        return false;
    }
    const elemCenter   = {
        x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
        y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
    };
    if (elemCenter.x < 0) return false;
    if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
    if (elemCenter.y < 0) return false;
    if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
    let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
    do {
        if (pointContainer === elem) return true;
    } while (pointContainer = pointContainer.parentNode);
    return false;
}

function getDate(timeStamp)
{
    var h = (timeStamp.getHours() < 10 ? "0" : "") + timeStamp.getHours();
    var m = (timeStamp.getMinutes() < 10 ? "0" : "") + timeStamp.getMinutes();
    var s = (timeStamp.getSeconds() < 10 ? "0" : "") + timeStamp.getSeconds();

    return h + ":" + m + ":" + s;
}

function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

function elementId() {
    return `elem-${uuidv4()}`;
}

function hasLink(text) {
    var hasLinkRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,}|[a-zA-Z0-9.]+\.[a-zA-Z0-9]{2,3}|\.[a-zA-Z0-9]{2,3})/g;
    return text.match(hasLinkRegex);
}

function linkToAnchor(link) {
    var newLink = link;
    var hasProtocol = link.includes('http');
    if (hasProtocol == false) newLink = `http://${newLink}`;
    return `<a href="${newLink}" target="_blank">${link}</a>`;
}
  


function cannedResponsesToTree(data) {
    var tree = {};

    Object.keys(data).forEach(x => {
        var response = data[x];
        response.children = [];

        try {
            if (response.ParentID != 0 && tree[response.ParentID] == null) {
                if(data[response.ParentID]) {
                    if(data[response.ParentID].children == null) {
                        data[response.ParentID].children = [];
                    }
                    data[response.ParentID].children.push(response);
                }
            } else if(response.ParentID == 0) {
                tree[response.ID] = response;

                Object.keys(data).forEach(z => {
                    if (data[z].ParentID == response.ID) tree[response.ID].children.push(data[z]);
                });
            }
        }
        catch (ex) {
            console.log(ex);
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