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
var config = require("./build.config.js");
var vendorJsfileName;
var appJsFileName;
var vendorCssFileName;
var appCssFileName;

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
    appCssFileName = buildName(config.names.output.appCss, "css");
    return gulp.src(config.appFiles.less)
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
            remove: false
        }))
        .pipe(concat(appCssFileName))
        .pipe(gulpIf(shouldMinify(), cssnano()))
        .pipe(gulp.dest(config.outputPaths.css))
        .pipe(connect.reload());
});

gulp.task("vendor-css", function () {
    vendorCssFileName = buildName(config.names.output.vendorCss, "css");
    var options = {
        filter: '**/*.css',
        debugging: false
    };
    return gulp.src(mainBowerFiles(options), {
        base: 'bower_components'
    })
        .pipe(concat(vendorCssFileName))
        .pipe(gulpIf(shouldMinify(), cssnano()))
        .pipe(gulp.dest(config.outputPaths.css));
});

gulp.task('lint', function () {
    return gulp.src(config.taskFiles.jshint)
        .pipe(jsHint())
        .pipe(jsHint.reporter('default'));
});

gulp.task("app-js", function () {
    appJsFileName = buildName(config.names.output.appJs, "js");
    return eventStream.merge(htmlJs(), appJs())
        .pipe(ngAnnotate())
        .pipe(angularFilesort())
        .pipe(concat(appJsFileName))
        .pipe(babel({presets: ['es2015']}))
        .pipe(gulpIf(shouldMinify(), uglify()))
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
    vendorJsfileName = buildName(config.names.output.vendorJs, "js");
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
        .pipe(concat(vendorJsfileName))
        .pipe(gulpIf(shouldMinify(), uglify()))
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
    return gulp.src(config.appFiles.images)
        .pipe(gulp.dest(config.outputPaths.images))
        .pipe(connect.reload());
});

gulp.task("default", ['build-index']);

gulp.task("build-index", gulpSync.sync(['prep', 'work']), function () {
    var target = gulp.src(config.appFiles.index);
    var sources = gulp.src([
        config.outputPaths.js + "/" + vendorJsfileName,
        config.outputPaths.js + "/" + appJsFileName,
        config.outputPaths.css + vendorCssFileName,
        config.outputPaths.css + appCssFileName
    ], {
        read: false
    });

    return target.pipe(inject(sources, {
        ignorePath: config.outputPaths.injectIgnoreString,
        addRootSlash: true
    }))
        .pipe(gulp.dest(config.outputPaths.root))
        .pipe(connect.reload());
});

gulp.task('prep', gulpSync.async(['bower', 'clean', 'constants']));

//gulp.task('work', gulpSync.async(['vendor-js', 'app-js', 'font', 'less', 'favicon', 'images']));

gulp.task('work', gulpSync.async(['vendor-css', 'vendor-js', 'app-js', 'static-font', 'font', 'less', 'favicon', 'images']));

gulp.task("watch", ["build-index", 'connect'], function () {
    gulp.watch(config.watch.less, ["less"]);
    gulp.watch([config.watch.js, config.watch.html], ["app-js"]);
    gulp.watch(config.watch.images, ['images']);
    gulp.watch(config.watch.constants, ["constants"]);
});

gulp.task('connect', function () {
    connect.server({
        root: config.outputPaths.root,
        port: 8080,
        livereload: true
    });
});

function buildName(name, extension) {
    var environment = argv.env || "dev";
    if (environment === 'dev' || environment === 'localqa') {
        return name + '.' + extension;
    }
    var ticks = new Date().getTime();
    return util.format("%s-%s.%s", name, ticks, extension);
}

function shouldMinify() {
    var environment = argv.env || "dev";
    if (environment === 'dev' || environment === 'localqa') {
        return false;
    }
    return true;
}
