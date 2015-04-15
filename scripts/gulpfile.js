var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var minifycss = require('gulp-minify-css');


gulp.task('dede-static', function() {
    gulp.start('js-minify', 'js-copy-lib', 'html-minify', 'css-minify');
});


//
gulp.task('js-minify', function() {
    return gulp.src(['../**/*.js', '!../src/flask/static/js/lib', '!node_modules/**', '!gulpfile.js'])
        .pipe(uglify())
        .pipe(gulp.dest('../target/dede'));
});
gulp.task('js-copy-lib', function() {
    return gulp.src('../src/flask/static/js/lib')
        .pipe(gulp.dest('../target/dede/src/flask/static/js'));
});

gulp.task('html-minify', function() {
    return gulp.src('../src/flask/static/**/*.html')
        .pipe(htmlmin({removeComments: true, collapseWhitespace: true}))
        .pipe(gulp.dest('../target/dede/src/flask/static'))
});

gulp.task('css-minify', function() {
    return gulp.src('../src/flask/static/css/**/*.css')
        .pipe(minifycss({keepBreaks:true}))
        .pipe(gulp.dest('../target/dede/src/flask/static/css'))
});

gulp.task('dede-python', function() {
    return gulp.src('../src/flask/**/*.py')
        .pipe(gulp.dest('../target/dede/src/flask'));
});


