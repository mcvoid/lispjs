define(["src/lexer", "src/parse"], function (Lexer, parse) {
    return function (str, continuation) {
        var tokens = new Lexer(str);
        return parse(tokens);
    };
});
