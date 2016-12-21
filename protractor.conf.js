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

  // baseUrl: 'http://localhost:8080',
  baseUrl: 'http://events.davehanagan.com',
  // baseUrl: 'file://Users/raysmith/Documents/hunkydory/xcodeIOSProjects/EventsList/web/server/public',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
