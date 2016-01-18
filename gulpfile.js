/*globals require, console, __dirname*/
'use strict';
var util = require("util");
var gulp = require("gulp");
var bower = require("gulp-bower");
var concat = require("gulp-concat");
var del = require('del');
var inject = require("gulp-inject");
var cssnano = require('gulp-cssnano');
var uglify = require("gulp-uglify");
var ngAnnotate = require("gulp-ng-annotate");
var html2js = require("gulp-ng-html2js");
var eventStream = require("event-stream");
var argv = require('yargs').argv;
var ngConstant = require('gulp-ng-constant');
var less = require('gulp-less');
var mainBowerFiles = require('main-bower-files');
var gulpSync = require('gulp-sync')(gulp);
var autoprefixer = require('gulp-autoprefixer');
var jsHint = require('gulp-jshint');
var gulpIf = require('gulp-if');
var connect = require('gulp-connect');
var angularFilesort = require('gulp-angular-filesort');
var babel = require('gulp-babel');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var rev = require('gulp-rev');
var config = require("./build.config.js");

gulp.task("clean", function () {
    del(config.outputPaths.root, {
        force: true
    }, function (err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
    });
});

gulp.task("bower", function () {
    return bower(config.appFiles.bowerRoot);
});

gulp.task("constants", function () {
    var environment = argv.env || "dev";
    console.log("writing config for %s", environment);
    var settings = require(config.appFiles.constants);
    var environmentSettings = settings[environment];
    return ngConstant({
        name: config.names.constantsModule,
        constants: environmentSettings,
        deps: [],
        wrap: true,
        stream: true
    })
        .pipe(gulp.dest(config.outputPaths.constants));
});

gulp.task('less', function () {
    return gulp.src(config.appFiles.less)
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
            remove: false
        }))
        .pipe(concat(config.names.output.appCss))
        .pipe(gulpIf(shouldMinify(), cssnano()))
        .pipe(gulpIf(shouldRevision(), rev()))
        .pipe(gulp.dest(config.outputPaths.css))
        .pipe(connect.reload());
});

gulp.task("vendor-css", function () {
    var options = {
        filter: '**/*.css',
        debugging: false
    };
    return gulp.src(mainBowerFiles(options), {base: 'bower_components'})
        .pipe(concat(config.names.output.vendorCss))
        .pipe(gulpIf(shouldMinify(), cssnano()))
        .pipe(gulpIf(shouldRevision(), rev()))
        .pipe(gulp.dest(config.outputPaths.css));
});

gulp.task('lint', function () {
    return gulp.src(config.taskFiles.jshint)
        .pipe(jsHint())
        .pipe(jsHint.reporter('default'));
});

gulp.task("app-js", function () {
    return eventStream.merge(htmlJs(), appJs())
        .pipe(ngAnnotate())
        .pipe(angularFilesort())
        .pipe(concat(config.names.output.appJs))
        .pipe(babel({presets: ['es2015']}))
        .pipe(gulpIf(shouldMinify(), uglify()))
        .pipe(gulpIf(shouldRevision(), rev()))
        .pipe(gulp.dest(config.outputPaths.js))
        .pipe(connect.reload());

    function appJs() {
        return gulp.src(config.appFiles.js);
    }

    function htmlJs() {
        var opts = {
            removeComments: true
        };
        return gulp.src(config.appFiles.html)
            .pipe(gulpIf(shouldMinify(), htmlmin(opts)))
            .pipe(html2js({
                moduleName: config.names.viewsModule
            }));
    }
});

gulp.task("vendor-js", function () {
    var options = {
        filter: '**/*.js',
        debugging: false
    };
    var mainBowerSourceFiles = gulp.src(mainBowerFiles(options), {
        base: 'bower_components'
    });
    var vendorJsSourceFiles = gulp.src(config.vendorFiles.js);
    return eventStream.merge(mainBowerSourceFiles, vendorJsSourceFiles)
        .pipe(ngAnnotate())
        .pipe(concat(config.names.output.vendorJs))
        .pipe(gulpIf(shouldMinify(), uglify()))
        .pipe(gulpIf(shouldRevision(), rev()))
        .pipe(gulp.dest(config.outputPaths.js));
});

gulp.task("font", function () {
    return gulp.src(mainBowerFiles({
            filter: '**/*.{eot,svg,ttf,woff,woff2}'
        }))
        .pipe(gulp.dest(config.outputPaths.fonts));
});

gulp.task("static-font", function () {
    return gulp.src(config.appFiles.fonts)
        .pipe(gulp.dest(config.outputPaths.fonts));
});

gulp.task('static-files', function () {
    return gulp.src(config.appFiles.staticFiles)
        .pipe(gulp.dest(config.outputPaths.root));
});

gulp.task('favicon', function () {
    return gulp.src(config.appFiles.favicon)
        .pipe(gulp.dest(config.outputPaths.root));
});

gulp.task('images', function () {
    var options = {
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    };
    return gulp.src(config.appFiles.images)
        .pipe(gulpIf(shouldMinify(), imagemin(options)))
        .pipe(gulp.dest(config.outputPaths.images))
        .pipe(connect.reload());
});

gulp.task('imagemin', function () {
    var options = {
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    };
    return gulp.src(config.appFiles.images)
        .pipe(imagemin(options))
        .pipe(gulp.dest(config.outputPaths.images))
        .pipe(connect.reload());
});

gulp.task("default", ['build-index']);

gulp.task("build-index", gulpSync.sync(['prep', 'work']), function () {
    var jsSources = gulp.src([
        config.outputPaths.js + "/**/*.js"
    ], {
        read: true
    }).pipe(angularFilesort());

    var cssSources = gulp.src([
        config.outputPaths.css + "/**/*.css"
    ], {
        read: false
    });

    return gulp.src(config.appFiles.index)
        .pipe(inject(jsSources, {
            ignorePath: config.outputPaths.injectIgnoreString,
            addRootSlash: true
        }))
        .pipe(inject(cssSources, {
            ignorePath: config.outputPaths.injectIgnoreString,
            addRootSlash: true
        }))
        .pipe(gulp.dest(config.outputPaths.root))
        .pipe(connect.reload());
});

gulp.task('prep', ['bower', 'clean', 'constants']);

//gulp.task('work', gulpSync.async(['vendor-js', 'app-js', 'font', 'less', 'favicon', 'images']));

gulp.task('work', ['vendor-css', 'vendor-js', 'app-js', 'static-font', 'font', 'less', 'favicon', 'images']);

gulp.task('watch', ['build-index', 'connect'], function () {
    gulp.watch(config.watch.less, ["less"]);
    gulp.watch([config.watch.js, config.watch.html], ["app-js"]);
    gulp.watch(config.watch.images, ['images']);
    gulp.watch(config.watch.constants, ["constants"]);
});

gulp.task('connect', ['build-index'], function () {
    connect.server({
        root: config.outputPaths.root,
        port: 9000,
        https: false,
        livereload: true,
        fallback: config.outputPaths.root + '/index.html'
    });
});

function shouldRevision() {
    var environment = argv.env || "dev";
    if (environment === 'dev' || environment === 'localqa') {
        return false;
    }
    return true;
}

function shouldMinify() {
    var environment = argv.env || "dev";
    if (environment === 'dev' || environment === 'localqa') {
        return false;
    }
    return true;
}
