var evaluate = require("./eval");
var read = require("./read");
var util = require("./util");
var env = require("./env");

module.exports = {
  eval: evaluate.bind(env),
  read: read,
  print: util.toString,
  define: env.def.bind(env),
};
