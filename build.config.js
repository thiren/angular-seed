module.exports = {
    appFiles: {
        js: ['./src/app/**/*.js', './src/config/**/*.js'],
        css: './src/app/**/*.css',
        less: './src/styles/main.less',
        html: ['./src/app/**/*.html'],
        index: './src/index.html',
        images: './src/images/**/*.*',
        fonts: ['./src/fonts/**/*.*'],
        constants: './src/config/constants.json',
        favicon: './src/favicon.ico',
        staticFiles: ['./web.config', '.src/unsupported-browser.html'],
        bowerRoot: './bower_components'
    },
    vendorFiles: {
        js: [
        ],
        css: [
        ]
    },
    taskFiles: {
        jshint: ['./src/app/**/*.js']
    },
    outputPaths: {
        js: './build/scripts',
        css: './build/css',
        fonts: './build/fonts',
        images: './build/images',
        root: './build',
        constants: './src/config',
        injectIgnoreString: '/build'
    },
    names: {
        mainModule: 'angular-seed',
        viewsModule: 'angular-seed.views',
        constantsModule: 'angular-seed.constants',
        output: {
            appCss: 'build.css',
            vendorCss: 'vendor.css',
            appJs: 'build.js',
            vendorJs: 'vendor.js'
        }
    },
    watch: {
        less: './src/styles/**/*.less',
        js: ['./src/app/**/*.js', './src/config/**/*.js'],
        images: './src/images/**/*.*',
        html: './src/**/*.html',
        constants: './src/config/constants.json'
    }
};
