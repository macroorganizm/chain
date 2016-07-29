var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("default", function () {
  return gulp.src("www/src/*")
    .pipe(babel())
    .pipe(gulp.dest("www/dist"));
});