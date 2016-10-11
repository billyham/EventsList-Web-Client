const webpackConfig = require('./webpack.config');

webpackConfig.entry = {};

module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: [ 'mocha', 'chai' ],

    files: [
      './src/app.js',
      './node_modules/angular-mocks/angular-mocks.js',
      './test/**/*.js'
    ],

    webpack: webpackConfig,

    exclue: [],

    preprocessors: {
      './src/app.js': [ 'webpack' ],
      './test/**/*.js': [ 'babel' ]
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome'],

    singleRun: false,

    concurrency: Infinity

  });
};
