'use strict';
var del = require('del');
var gulp = require('gulp');
var rev = require('gulp-rev');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
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
var gulpIf = require('gulp-if');
var connect = require('gulp-connect');
var angularFilesort = require('gulp-angular-filesort');
var babel = require('gulp-babel');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var config = require('./build.config.js');

var environment = 'development';
if (typeof argv.env === 'string' && config.environments.indexOf(argv.env.toLowerCase()) > -1) {
    environment = argv.env.toLowerCase();
}

var htmlminOptions = {
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeComments: true
};

var templateCacheOptions = {
    standalone: true,
    module: config.names.templatesModule,
    moduleSystem: 'IIFE'
};

var gulpNgConfigOptions = {
    environment: environment,
    createModule: true,
    wrap: '(function () {\n <%= module %> \n})();'
};

gulp.task('lint', function () {
    return gulp.src(config.taskFiles.eslint)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
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
    return gulp.src(config.appFiles.constants)
        .pipe(gulpNgConfig(config.names.constantsModule, gulpNgConfigOptions))
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
    return gulp.src(config.appFiles.html)
        .pipe(htmlmin(htmlminOptions))
        .pipe(templateCache(config.names.output.templatesJs, templateCacheOptions))
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
    var vendorJsSourceFiles = gulp.src(config.vendorFiles.js);
    var options = {
        filter: '**/*.js',
        debugging: false
    };
    var mainBowerSourceFiles = gulp.src(mainBowerFiles(options), {
        base: 'bower_components'
    });
    return eventStream.merge(vendorJsSourceFiles, mainBowerSourceFiles)
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

gulp.task('manifest', function () {
    return gulp.src(config.appFiles.manifest)
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
        config.outputPaths.js + '/main*.js'
    ], {
        read: false
    });

    var cssFiles = gulp.src([
        config.outputPaths.css + '/vendor*.css',
        config.outputPaths.css + '/main*.css'
    ], {
        read: false
    });
    var options = {
        ignorePath: config.outputPaths.injectIgnoreString,
        addRootSlash: false
    };
    console.log('Environment: %s', environment);
    return gulp.src(config.appFiles.index)
        .pipe(wait(1000))
        .pipe(inject(cssFiles, options))
        .pipe(inject(jsFiles, options))
        .pipe(htmlmin(htmlminOptions))
        .pipe(gulp.dest(config.outputPaths.root))
        .pipe(connect.reload());
});

gulp.task('default', ['build-index']);

gulp.task('work', ['html', 'vendor-css', 'less', 'vendor-js', 'app-js', 'static-font', 'font', 'favicon', 'manifest', 'images']);

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
        port: config.port,
        livereload: true,
        fallback: config.outputPaths.root + '/index.html'
    });
});

gulp.task('start', function () {
    connect.server({
        root: config.outputPaths.root,
        port: config.port,
        livereload: false,
        fallback: config.outputPaths.root + '/index.html'
    });
});

function shouldRevision() {
    if (environment === 'development') {
        return false;
    }
    return true;
}

function shouldMinify() {
    if (environment === 'development') {
        return false;
    }
    return true;
}

gulp.task('test:build', ['test:clean', 'test:app-js', 'test:vendor-js', 'test:constants', 'test:html']);

gulp.task('test:clean', function (callback) {
    var options = {
        force: true
    };
    del(config.tempFiles, options).then(function (paths) {
        console.log('Deleted generated test files/folders:\n', paths.join('\n'));
        callback();
    });
});

gulp.task('test:app-js', ['test:clean'], function () {
    return gulp.src(config.appFiles.js)
        .pipe(angularFilesort())
        .pipe(ngAnnotate())
        .pipe(babel({presets: ['es2015']}))
        .pipe(concat(config.names.output.appJs))
        .pipe(uglify())
        .pipe(gulp.dest(config.outputPaths.testDependencies));
});

gulp.task('test:vendor-js', ['test:clean'], function () {
    var vendorJsSourceFiles = gulp.src(config.vendorFiles.js);
    var options = {
        filter: '**/*.js',
        debugging: false
    };
    var mainBowerSourceFiles = gulp.src(mainBowerFiles(options), {
        base: 'bower_components'
    });
    return eventStream.merge(vendorJsSourceFiles, mainBowerSourceFiles)
        .pipe(ngAnnotate())
        .pipe(concat(config.names.output.vendorJs))
        .pipe(uglify())
        .pipe(gulp.dest(config.outputPaths.testDependencies));
});

gulp.task('test:constants', ['test:clean'], function () {
    return gulp.src(config.appFiles.constants)
        .pipe(gulpNgConfig(config.names.constantsModule, gulpNgConfigOptions))
        .pipe(uglify())
        .pipe(gulp.dest(config.outputPaths.testDependencies));
});

gulp.task('test:html', ['test:clean'], function () {
    return gulp.src(config.appFiles.html)
        .pipe(htmlmin(htmlminOptions))
        .pipe(templateCache(config.names.output.templatesJs, templateCacheOptions))
        .pipe(uglify())
        .pipe(gulp.dest(config.outputPaths.testDependencies))
});
