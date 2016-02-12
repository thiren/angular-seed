'use strict';
var util = require('util');
var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');
var inject = require('gulp-inject');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var templateCache = require('gulp-angular-templatecache');
var eventStream = require('event-stream');
var argv = require('yargs').argv;
var gulpNgConfig = require('gulp-ng-config');
var less = require('gulp-less');
var mainBowerFiles = require('main-bower-files');
var gulpSync = require('gulp-sync')(gulp);
var wait = require('gulp-wait');
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
var config = require('./build.config.js');

var environment = 'development';
if (typeof argv.env === 'string' && config.environments.indexOf(argv.env.toLowerCase()) > -1) {
    environment = argv.env.toLowerCase();
}

gulp.task('lint', function () {
    return gulp.src(config.taskFiles.jshint)
        .pipe(jsHint())
        .pipe(jsHint.reporter('default'));
});

gulp.task('clean', function (callback) {
    var options = {
        force: true
    };
    del(config.buildFiles, options).then(function (paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
        callback();
    });
});

gulp.task('constants', function () {
    var options = {
        environment: environment,
        createModule: true,
        wrap: '(function () {\n <%= module %> \n})();'
    };
    return gulp.src(config.appFiles.constants)
        .pipe(gulpNgConfig(config.names.constantsModule, options))
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

gulp.task('html', function () {
    var htmlminOptions = {
        collapseWhitespace: true,
        removeComments: true
    };
    var options = {
        standalone: true,
        module: config.names.templatesModule,
        moduleSystem: 'IIFE'
    };
    return gulp.src(config.appFiles.html)
        .pipe(htmlmin(htmlminOptions))
        .pipe(templateCache(config.names.output.templatesJs, options))
        .pipe(gulpIf(shouldMinify(), uglify()))
        .pipe(gulpIf(shouldRevision(), rev()))
        .pipe(gulp.dest(config.outputPaths.templates))
        .pipe(connect.reload());
});

gulp.task('vendor-css', function () {
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

gulp.task('app-js', ['constants'], function () {
    return gulp.src(config.appFiles.js)
        .pipe(angularFilesort())
        .pipe(ngAnnotate())
        .pipe(babel({presets: ['es2015']}))
        .pipe(concat(config.names.output.appJs))
        .pipe(gulpIf(shouldMinify(), uglify()))
        .pipe(gulpIf(shouldRevision(), rev()))
        .pipe(gulp.dest(config.outputPaths.js))
        .pipe(connect.reload());
});

gulp.task('vendor-js', function () {
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

gulp.task('font', function () {
    return gulp.src(mainBowerFiles({
            filter: '**/*.{eot,svg,ttf,woff,woff2}'
        }))
        .pipe(gulp.dest(config.outputPaths.fonts));
});

gulp.task('static-font', function () {
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
        optimizationLevel: 3,
        progressive: true,
        interlaced: true,
        multipass: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    };
    return gulp.src(config.appFiles.images)
        .pipe(gulpIf(shouldMinify(), imagemin(options)))
        .pipe(gulp.dest(config.outputPaths.images))
        .pipe(connect.reload());
});

gulp.task('build-index', gulpSync.sync(['clean', 'work']), function () {
    var jsFiles = gulp.src([
        config.outputPaths.js + '/vendor*.js',
        config.outputPaths.js + '/templates*.js',
        config.outputPaths.js + '/build*.js'
    ], {
        read: false
    });

    var cssFiles = gulp.src([
        config.outputPaths.css + '/vendor*.css',
        config.outputPaths.css + '/build*.css'
    ], {
        read: false
    });
    var options = {
        ignorePath: config.outputPaths.injectIgnoreString,
        addRootSlash: false,
        read: false
    };
    console.log('Environment: %s', environment);
    return gulp.src(config.appFiles.index)
        .pipe(wait(1000))
        .pipe(inject(cssFiles, options))
        .pipe(inject(jsFiles, options))
        .pipe(gulp.dest(config.outputPaths.root))
        .pipe(connect.reload());
});

gulp.task('default', ['build-index']);

gulp.task('work', ['html', 'vendor-css', 'less', 'vendor-js', 'app-js', 'static-font', 'font', 'favicon', 'images']);

gulp.task('watch', ['build-index', 'connect'], function () {
    gulp.watch(config.watch.less, ['less']);
    gulp.watch(config.watch.js, ['app-js']);
    gulp.watch(config.watch.html, ['html']);
    gulp.watch(config.watch.images, ['images']);
    gulp.watch(config.watch.constants, ['app-js']);
});

gulp.task('connect', ['build-index'], function () {
    connect.server({
        root: config.outputPaths.root,
        port: 9000,
        livereload: true,
        fallback: config.outputPaths.root + '/index.html'
    });
});

gulp.task('start', function () {
    connect.server({
        root: config.outputPaths.root,
        port: 9000,
        livereload: false,
        fallback: config.outputPaths.root + '/index.html'
    });
});

function shouldRevision() {
    if (environment === 'development' || environment === 'localqa') {
        return false;
    }
    return true;
}

function shouldMinify() {
    if (environment === 'development' || environment === 'localqa') {
        return false;
    }
    return true;
}

gulp.task('test:build', ['test:clean', 'test:constants', 'test:html']);

gulp.task('test:clean', function (callback) {
    var options = {
        force: true
    };
    del(config.tempFiles, options).then(function (paths) {
        console.log('Deleted generated test files/folders:\n', paths.join('\n'));
        callback();
    });
});

gulp.task('test:constants', ['test:clean'], function () {
    var options = {
        environment: 'test',
        createModule: true,
        wrap: '(function () {\n <%= module %> \n})();'
    };
    return gulp.src(config.appFiles.constants)
        .pipe(gulpNgConfig(config.names.constantsModule, options))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(config.outputPaths.testDependencies));
});

gulp.task('test:html', ['test:clean'], function () {
    var htmlminOptions = {
        collapseWhitespace: true,
        removeComments: true
    };
    var options = {
        standalone: true,
        module: config.names.templatesModule,
        moduleSystem: 'IIFE'
    };
    return gulp.src(config.appFiles.html)
        .pipe(htmlmin(htmlminOptions))
        .pipe(templateCache(config.names.output.templatesJs, options))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(config.outputPaths.testDependencies))
});