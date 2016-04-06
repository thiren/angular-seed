module.exports = {
    environments: ['development', 'qa', 'production', 'test'],
    appFiles: {
        js: ['./src/app/**/*.js', './src/configs/**/*.js', '!./src/app/**/*.spec.js'],
        css: './src/app/**/*.css',
        less: './src/styles/main.less',
        html: ['./src/app/**/*.html'],
        index: './src/index.html',
        images: './src/images/**/*.*',
        fonts: ['./src/fonts/**/*.*'],
        constants: './src/configs/constants.json',
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
    buildFiles: ['./build/**/*.*', './build/*', './src/configs/*.js'],
    tempFiles: ['./temp'],
    outputPaths: {
        js: './build/scripts',
        css: './build/css',
        fonts: './build/fonts',
        images: './build/images',
        root: './build',
        constants: './src/configs',
        templates: './build/scripts',
        testDependencies: './temp',
        injectIgnoreString: '/build'
    },
    names: {
        mainModule: 'angularSeed',
        templatesModule: 'angularSeed.templates',
        constantsModule: 'angularSeed.constants',
        output: {
            appCss: 'build.css',
            vendorCss: 'vendor.css',
            appJs: 'build.js',
            vendorJs: 'vendor.js',
            templatesJs: 'templates.js'
        }
    },
    watch: {
        less: './src/styles/**/*.less',
        js: ['./src/app/**/*.js', '!./src/app/**/*.spec.js'],
        images: './src/images/**/*.{svg,png,jpg,jpeg,webp,gif}',
        html: './src/app/**/*.html',
        index: './src/index.html',
        constants: './src/configs/constants.json'
    }
};
