const Express = require('express');
const Path = require('path');
const App = Express();

App.use(Express.static('../src'));
App.get("/", (r, rs) => {
    rs.sendFile(Path.join(__dirname + '/index.html'));
});


App.listen(8080, "localhost", (arg) => {
    console.log("Hosting on :8080");
});