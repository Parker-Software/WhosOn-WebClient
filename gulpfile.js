const { src, dest, series } = require("gulp");
var eslint = require("gulp-eslint");
var del = require("del");

function clean() {
    return del(["dist/**/*.js", "dist/**/*.css", "dist/**/*.html","dist/**/*.png","dist/**/*.less"]);
}

function lintjs() {
    return src(["**/*.js","!node_modules/**", "!gulpfile.js"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

exports.clean = clean;
exports.lintjs = lintjs;

exports.default = series(clean, lintjs);

