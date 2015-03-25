// Defines a lexical analyzer
// Usage:
// var l = new Lexer("(someString)");
// if (l.hasNext()) {
//   var lookahead = l.peek();
//   l.next();
// }
define(function () {
  function tokenize(str) {
    return str.replace(/\(/g, " ( ")
      .replace(/\)/g, " ) ")
      .trim()
      .replace(/[ \t\n]+/g, " ")
      .split(" ")
      .map(function (s) {
        return s.trim();
      });
  }

  return function (str) {
    var tokens = tokenize(str);
    this.tokenList = tokens;
    this.peek = function () {
      return tokens[0];
    };
    this.next = function () {
      return tokens.shift();
    };
    this.hasNext = function () {
      return tokens.length > 0;
    };
    return this;
  };
});
