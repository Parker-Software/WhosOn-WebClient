const { src, dest, series, watch, parallel } = require("gulp");
var eslint = require("gulp-eslint");
var del = require("del");
var sass = require("gulp-sass");
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
    return del(["dist/**/*.*"]);
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

exports.default = series(clean, scss, lintjs, [moveHTML, moveImages,moveFonts, moveVendor]);

