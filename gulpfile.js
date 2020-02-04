const { src, dest, series, watch, parallel } = require("gulp");
const replace = require('gulp-replace');
const eslint = require("gulp-eslint");
const del = require("del");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const browsersync = require("browser-sync").create();

var buildFolder = "./dist" 
var build = 'dev';
var version = '1.0.0';


function setVersion(){
  if(Object.entries(args).length > 0){ 
    version = args.ver;
    console.log('<--- Building version: ' + version);     
    return src('.');
  }
  console.log('<--- Building Dev version: ' + version); 
  return src('.');
}

function browserSync(done) {
    browsersync.init({
      server: {
        baseDir: "./dist"
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
    return del([buildFolder]);
}

function scss(){
  return src("./src/style/scss/style.scss")
  .pipe(sass().on("error", sass.logError))
  .pipe(dest(buildFolder + "/assets/css/"));
}

function lintjs() {
    return src(["**/*.js","!node_modules/**", "!gulpfile.js"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

function html() {
  var urls = {
    style: "assets/css/style.css",
    vue: "assets/vendor/vue.js",
    vuex: "assets/vendor/vuex.js",
    libs: "assets/js/libs.js",
    componenets: "assets/js/components.js",
    main: "assets/js/main.js"
  }

  var baseURL = {
    staging: "https://cdn.whoson.com/webclient/staging_v1",
    prod: "https://cdn.whoson.com/webclient/v1"
  }

  Object.keys(urls).forEach((k) => {
    if(baseURL[build]) {
      urls[k] = `${baseURL[build]}/${urls[k]}`;
    }
  });

  return src(["./src/html/index.html"])
    .pipe(replace('$favicon', "favicon.ico"))
    .pipe(replace('$style', urls['style']))
    .pipe(replace('$vueLib', urls['vue']))
    .pipe(replace('$vuexLib', urls['vuex']))
    .pipe(replace('$libs', urls['libs']))
    .pipe(replace('$connection', "assets/js/connectionSettings.js"))
    .pipe(replace('$components', urls['componenets']))
    .pipe(replace('$main', urls['main']))
    .pipe(dest(buildFolder));
}

function moveFavIcon(){
    return src(["./src/html/favicon.ico"])
    .pipe(dest(buildFolder));
}

function packLibs(){
  return src(["./src/assets/libs/**/*.js",
  "./src/assets/classes/defaultStateOptions.js",
  "./src/assets/classes/store.js",
  "./src/assets/classes/chatFactory.js",
  "./src/assets/hooks/**/*.js"])
  .pipe(replace('$version', version))
  .pipe(concat("libs.js"))
  .pipe(dest(buildFolder + "/assets/js/"))
}

function packComponents(){
  return src("./src/components/**/*.js")
  .pipe(concat("components.js"))
  .pipe(dest(buildFolder + "/assets/js/"))
}

function moveConnectionSettings() {
  return src("./src/connectionSettings.js")  
  .pipe(dest(buildFolder + "/assets/js/"))
}

function moveJS() {
  return src(["./src/assets/classes/vueApp.js", "./src/assets/classes/authentication.js", "./src/assets/classes/main.js", "./src/assets/classes/stateManager.js"])  
  .pipe(concat("main.js"))
  .pipe(dest(buildFolder + "/assets/js/"))
}

function moveImages(){
    return src("./src/assets/images/*.*")
    .pipe(dest(buildFolder + "/assets/images/"));
}

function moveFonts(){
  return src("./src/assets/webfonts/*.*")
  .pipe(dest(buildFolder + "/assets/webfonts/"));
}

function moveVendor(){
  return src("./src/assets/vendor/**/*.js")
  .pipe(dest(buildFolder + "/assets/vendor/"));
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

exports.default = series(clean, scss, lintjs, [moveFavIcon, moveImages,moveFonts, moveVendor, setVersion,
  packLibs, packComponents, moveJS, moveConnectionSettings], html);
exports.cdn = series(setCDN, clean, scss, lintjs, [moveImages ,moveFonts, moveVendor, setVersion,
  packLibs, packComponents, moveJS]);
exports.prod = series(setPROD, clean, [moveFavIcon, moveConnectionSettings], html);
exports.stage =  series(setStaging, clean, [moveFavIcon, moveConnectionSettings], html);
exports.monitor = parallel(watchFiles, browserSync);
exports.lint = lintjs;
exports.setVersion = setVersion;

function setCDN(){  
  console.log("<--- Starting CDN Build --->");
  buildFolder = './cdn';
  build = 'cdn';
  return src('.');
}

function setPROD(){  
  console.log("<--- Starting Production Build --->");
  buildFolder = './prod';
  build = 'prod';
  return src('.');
}

function setStaging(){  
  console.log("<--- Starting Staging Build --->");
  buildFolder = './staging';
  build = 'staging';
  return src('.');
}


const args = (argList => {

  let arg = {}, a, opt, thisOpt, curOpt;
  for (a = 0; a < argList.length; a++) {

    thisOpt = argList[a].trim();
    opt = thisOpt.replace(/^\-+/, '');

    if (opt === thisOpt) {
      if (curOpt) arg[curOpt] = opt;
      curOpt = null;

    }
    else {
      curOpt = opt;
      arg[curOpt] = true;

    }

  }

  return arg;

})(process.argv);
