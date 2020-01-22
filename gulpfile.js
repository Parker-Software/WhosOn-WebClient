const { src, dest, series, watch, parallel } = require("gulp");
const replace = require('gulp-replace');
const eslint = require("gulp-eslint");
const del = require("del");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const browsersync = require("browser-sync").create();


function browserSync(done) {
    browsersync.init({
      server: {
        baseDir: "./dist/"
      },
      port: 3000
    });
    done();
}
  
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function clean() {
    return del(["dist"]);
}

function scss(){
    return src("./src/style/scss/style.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("./dist/assets/css/"));
}

function lintjs() {
    return src(["**/*.js","!node_modules/**", "!gulpfile.js"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

function html() {
  var urls = {
    favicon: "favicon.ico",
    style: "assets/css/style.css",
    vue: "assets/vendor/vue.js",
    vuex: "assets/vendor/vuex.js",
    chart: "assets/vendor/Chart.min.js",
    libs: "assets/js/libs.js",
    connection: "assets/js/connectionSettings.js",
    componenets: "assets/js/components.js",
    main: "assets/js/main.js"
  }

  var baseURL = {
    staging: "cdn.whoson.com/webclient/staging_v1",
    prod: "cdn.whoson.com/webclient/v1"
  }

  Object.keys(urls).forEach((k) => {
    if(baseURL[build]) {
      urls[k] = `${baseURL[build]}/${urls[k]}`;
    }
  });

  return src(["./src/html/index.html"])
    .pipe(replace('$favicon', urls['favicon']))
    .pipe(replace('$style', urls['style']))
    .pipe(replace('$vueLib', urls['vue']))
    .pipe(replace('$vuexLib', urls['vuex']))
    .pipe(replace('$chart', urls['chart']))
    .pipe(replace('$libs', urls['libs']))
    .pipe(replace('$connection', urls['connection']))
    .pipe(replace('$components', urls['componenets']))
    .pipe(replace('$main', urls['main']))
    .pipe(dest("./dist/"));
}

function moveFavIcon(){
    return src(["./src/html/favicon.ico"])
    .pipe(dest("./dist/"));
}

function packLibs(){
  return src(["./src/assets/libs/**/*.js",
  "./src/assets/defaultStateOptions.js",
  "./src/assets/store.js",
  "./src/assets/chatFactory.js",
  "./src/assets/hooks/**/*.js"])
  .pipe(concat("libs.js"))
  .pipe(dest("./dist/assets/js/"))
}

function packComponents(){
  return src("./src/components/**/*.js")
  .pipe(concat("components.js"))
  .pipe(dest("./dist/assets/js/"))
}

function moveConnectionSettings() {
  return src("./src/connectionSettings.js")  
  .pipe(dest("./dist/assets/js/"))
}

function moveJS() {
  return src(["./src/assets/vueApp.js", "./src/assets/authentication.js", "./src/assets/main.js", "./src/assets/stateManager.js"])  
  .pipe(concat("main.js"))
  .pipe(dest("./dist/assets/js/"))
}

function moveImages(){
    return src("./src/assets/images/*.*")
    .pipe(dest("./dist/assets/images/"));
}

function moveFonts(){
  return src("./src/assets/webfonts/*.*")
  .pipe(dest("./dist/assets/webfonts/"));
}

function moveVendor(){
  return src("./src/assets/vendor/**/*.js")
  .pipe(dest("./dist/assets/vendor/"));
}

function watchFiles() {
    watch("./src/*.js", moveConnectionSettings);
    watch("./src/style/**/*", scss);
    watch("./src/assets/images/*", moveImages);
    watch("./src/html/*", series(moveFavIcon, html));
    watch("./src/assets/**/*.js", series(packLibs, moveJS));
    watch("./src/components/**/*.js", packComponents);
    watch(
      [
        "./dist/assets/**/*",
        "./dist/*"
      ],
      series(browserSyncReload)
    );    
  }


const monitor = parallel(watchFiles, browserSync);
exports.monitor = monitor;

const commandLineArgs = require('command-line-args');
const optionDefinitions = [
  { name: 'monitor' },
  { name: 'mode', type: String },
  { name: 'build', type: String }
]

var mode = 'dev'; // modes - dev, cdn, prod
var build = 'dev'; // build - dev, staging, prod

const options = commandLineArgs(optionDefinitions, { partial: true });

mode = options.mode || mode;
build = options.build || build;

exports.default = series((cb) => {
  if(mode == 'dev') devBuild();
  else if(mode == 'cdn') cdnBuild();
  else if(mode == 'prod') prodBuild();
  cb();
});


var devBuild = series(clean, scss, lintjs, [moveFavIcon, moveImages,moveFonts, moveVendor, 
  packLibs, packComponents, moveJS, moveConnectionSettings], html);

var cdnBuild = series(clean, scss, lintjs, [moveFavIcon, moveImages,moveFonts, moveVendor, 
  packLibs, packComponents, moveJS]);
var prodBuild = series(clean, [moveConnectionSettings], html);