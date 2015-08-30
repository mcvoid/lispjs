var util = require("../src/util.js");
var parse = require("../src/parse.js");

function MockLexer(tokens) {
  this.peek = function () { return util.first(tokens); };
  this.next = function () { return tokens.shift(); };
  this.hasNext = function () { return tokens.length > 0; };
  return this;
}

describe("Parser tests", function() {
  it("test parser existence", function() {
    expect(parse).toBeDefined();
    expect(typeof parse).toEqual("function");
  });
  it("parses primitives", function() {
    var l = new MockLexer(["0", "-10.1", "true", "false"]);
    expect(parse(l)).toEqual(0);
    expect(parse(l)).toEqual(-10.1);
    expect(parse(l)).toEqual(true);
    expect(parse(l)).toEqual(false);
  });
  it("parses lists", function() {
    var l = new MockLexer([
      "(", ")",
      "(", "10", "5", ")",
      "(", "(", "3", ")", "(", "3", ")", ")",
      "nil"
    ]);
    expect(parse(l)).toEqual([]);
    expect(parse(l)).toEqual([10, 5]);
    expect(parse(l)).toEqual([[3], [3]]);
    expect(parse(l)).toEqual([]);
  });
  it("parses symbols", function() {
    var l = new MockLexer(["abc", "D01", "+-*/_?!<>=%"]);
    expect(parse(l)).toEqual(new util.Symbol("abc"));
    expect(parse(l)).toEqual(new util.Symbol("D01"));
    expect(parse(l)).toEqual(new util.Symbol("+-*/_?!<>=%"));
  });
  it("parses quotes", function() {
    var l = new MockLexer(["'", "(", 1, 2, ")"]);
    expect(parse(l)).toEqual([new util.Symbol("quote"), [1, 2]]);
  });
});
