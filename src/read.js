var Lexer = require("./lexer");
var parse = require("./parse");

module.exports = function (str, continuation) {
  var tokens = new Lexer(str);
  return parse(tokens);
};
