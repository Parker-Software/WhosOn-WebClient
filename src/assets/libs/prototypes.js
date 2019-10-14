function Copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}



function getDate(timeStamp)
{
    var h = (timeStamp.getHours() < 10 ? '0' : '') + timeStamp.getHours();
    var m = (timeStamp.getMinutes() < 10 ? '0' : '') + timeStamp.getMinutes();
    var s = (timeStamp.getSeconds() < 10 ? '0' : '') + timeStamp.getSeconds();

    return h + ':' + m + ':' + s;
}