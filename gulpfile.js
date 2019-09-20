const { src, dest, series, watch, parallel } = require("gulp");
var eslint = require("gulp-eslint");
var del = require("del");
var sass = require("gulp-sass");
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

function moveHTML(){
    return src("./src/html/*.*")
    .pipe(dest("./dist/"));
}

function packLibs(){
  return src(["./src/assets/libs/**/*.js", "./src/assets/store.js","./src/assets/chatFactory.js", "./src/assets/storeUpdater.js"])
  .pipe(concat("libs.js"))
  .pipe(dest("./dist/assets/js/"))
}

function packComponents(){
  return src("./src/components/**/*.js")
  .pipe(concat("components.js"))
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
    watch("./src/style/**/*", scss);
    watch("./src/assets/images/*", moveImages);
    watch("./src/html/*", moveHTML);
    watch("./src/assets/**/*.js", series(packLibs, moveJS));
    watch("./src/components/**/*.js", packComponents)
    watch(
      [
        "./dist/assets/**/*",
        "./dist/*"
      ],
      series(browserSyncReload)
    );    
  }


const monitor = parallel(watchFiles, browserSync);
exports.clean = clean;
exports.lintjs = lintjs;
exports.scss = scss;
exports.moveHTML = moveHTML;
exports.moveImages = moveImages;
exports.monitor = monitor;
exports.moveFonts = moveFonts;
exports.moveVendor = moveVendor;
exports.moveJS = moveJS;
exports.packLibs = packLibs;
exports.packComponents = packComponents;

exports.default = series(clean, scss, lintjs, [moveHTML, moveImages,moveFonts, moveVendor, 
                          packLibs, packComponents, moveJS]);

