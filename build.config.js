module.exports = {
    appFiles: {
        js: ['./src/app/**/*.js', './src/config/**/*.js'],
        css: './src/app/**/*.css',
        less: './src/styles/main.less',
        html: ['./src/app/**/*.html'],
        index: './src/index.html',
        images: './src/images/**/*.*',
        font: ['font/**/*.*'],
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
    outputPaths: {
        js: './build/scripts/',
        css: './build/css/',
        font: './build/fonts/',
        images: './build/images/',
        root: './build/',
        constants: './src/config/',
        injectIgnoreString: '/build/'
    },
    names: {
        mainModule: 'angular-seed',
        viewsModule: 'angular-seed.views',
        constantsModule: 'angular-seed.constants',
        output: {
            appCss: 'build',
            vendorCss: 'vendor',
            appJs: 'build',
            vendorJs: 'vendor'
        }
    },
    watch: {
        less: './src/styles/**/*.less',
        js: ['./src/app/**/*.js', './src/config/**/*.js'],
        images: './src/images/**/*.*',
        html: './src/app/**/*.html',
        constants: './src/config/constants.json'
    }
};
