module.exports = {
    appFiles: {
        js: ['./app/**/*.js', './config/**/*.js'],
        css: './app/**/*.css',
        less: './style/main.less',
        html: ['./app/**/*.html'],
        index: './app/index.html',
        images: './images/**/*.*',
        constants: './config/settings.module.json',
        bowerRoot: './bower_components'
    },
    vendorFiles: {
        js: [
        ],
        css: [
        ]
    },
    outputPaths: {
        js: "./build/scripts/",
        css: "./build/css/",
        font: "./build/fonts/",
        images: './build/images/',
        root: "./build/",
        constants: './config/',
        injectIgnoreString: '/build/'
    },
    names: {
        mainModule: 'angular-seed',
        viewsModule: 'angular-seed.views',
        output: {
            appCss: "build",
            vendorCss: "vendor",
            appJs: "build",
            vendorJs: "vendor"
        }
    },
    watch: {
        less: './style/**/*.less',
        js: ['./app/**/*.js', './config/**/*.js'],
        images: './images/**/*.*',
        html: './app/**/*.html',
        constants: './config/settings.module.json'
    }
};
