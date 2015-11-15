'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var connect = require('gulp-connect');
var inject = require('gulp-inject');
var angular = require('gulp-angular-filesort');
var bowerFiles = require('main-bower-files');
var babel = require('gulp-babel');
var concat = require('gulp-concat');

gulp.task('lint', function () {
    return gulp.src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default', {verbose: true}));
});

gulp.task('html', function () {
    gulp.src('./app/*.html')
        .pipe(connect.reload());
});

gulp.task('index', function () {
    var target = gulp.src('./app/index.html');
    var sources = gulp.src(['./app/**/*.js', './app/**/*.css'], {read: false})
        .pipe(angularFilesort());

    return target.pipe(inject(sources))
        .pipe(gulp.dest('./public'));
});

gulp.task('connect', function () {
    connect.server({
        root: 'app',
        port: 9000,
        livereload: true
    });
});

gulp.task('watch', function () {
    gulp.watch(['./app/*.html'], ['html']);
});

gulp.task('default', ['connect', 'watch']);

//gulp.task('default', function () {
//    return gulp.src('src/app.js')
//        .pipe(babel({
//            presets: ['es2015']
//        }))
//        .pipe(gulp.dest('dist'));
//});
