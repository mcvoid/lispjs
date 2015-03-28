var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  baseUrl: '/base',

  deps: allTestFiles,
  paths: {
    underscore: 'lib/underscore-min'
  },
  shim: {
    "underscore": {
      exports: "_"
    }
  },
  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
