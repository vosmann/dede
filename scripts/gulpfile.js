var gulp = require('gulp');
var uglify = require('gulp-uglify');
// var concat = require('gulp-concat');

gulp.task('js', function() {

    gulp.src(['../**/*.js', '!../src/flask/static/js/lib', '!node_modules/**', '!gulpfile.js'])
    // .pipe(concat('full.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('../target/dede'));

    gulp.src('../src/flask/static/js/lib')
    .pipe(gulp.dest('../target/dede/src/flask/static/js/'));
});
