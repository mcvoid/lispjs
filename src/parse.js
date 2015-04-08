// Defines a function which takes a token as input and returns a form.
define(["src/util"], function (util) {
  var nil = [];
  var matchFunc = function(re) {
    return function(s){
      return re.test(s);
    };
  };
  var isInt = matchFunc(/^(\-|\+)?([0-9]+|Infinity)$/);
  var isFloat = matchFunc(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/);
  var isSymbol = matchFunc(/^[\w+\-*/?!<>=%\.]+$/);

  return function parse(tokens) {
    var tok = tokens.next();

    function parseList() {
      var list = [];
      while (tokens.peek() !== ")") {
        list.push(parse(tokens));
      }
      tokens.next();
      return list;
    }

    function parseQuote() {
      return [new util.Symbol("quote"), parse(tokens)];
    }

    if (isInt(tok) || isFloat(tok)) {
      return parseFloat(tok);
    } else if (tok === "true") {
      return true;
    } else if (tok === "false") {
      return false;
    } else if (tok === "nil") {
      return nil;
    } else if (isSymbol(tok)) {
      return new util.Symbol(tok);
    } else if (tok === "(") {
      return parseList();
    } else if (tok === "'") {
      return parseQuote();
    }
    return nil;
  };
});
