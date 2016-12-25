exports.config = {

  allScriptsTimeout: 25000,

  specs: [
    'test-e2e/**/*.js'
  ],
  // OR, define suites
  // suites: {
  //   home: 'test-e2e/home.test.js',
  //   full: 'test-e2e/**/*.test.js'
  // },

  capabilities: {
    browserName: 'chrome'
  },

  //To let protractor to start a server for us
  // seleniumAddress: 'http://localhost:4444/wd/hub',

  // Testing webpack-dev-server
  baseUrl: 'http://localhost:8080',
  // Testing live mock site
  // baseUrl: 'http://events.davehanagan.com',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
