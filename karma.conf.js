module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'requirejs'],
    files: [
      {pattern: 'lib/**/*.js', included: false},
      {pattern: 'lib/**/*.map', included: false},
      {pattern: 'src/**/*.js', included: false},
      {pattern: 'test/**/*Test.js', included: false},

      'test/test-main.js'
    ],
    exclude: [],
    preprocessors: {},
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [],
    singleRun: false
  });
};
