define([
  "src/util",
  "src/eval",
  "src/env"
], function(util, e, env) {
  var def = new util.Symbol("def");
  var defn = new util.Symbol("defn");
  var defmacro = new util.Symbol("defmacro");
  var fn = new util.Symbol("fn");
  var quote = new util.Symbol("quote");
  var letvar = new util.Symbol("let");
  var makelist = new util.Symbol("list");
  var cons = new util.Symbol("cons");
  var first = new util.Symbol("first");
  var rest = new util.Symbol("rest");
  var concat = new util.Symbol("concat");
  var range = new util.Symbol("range");
  var len = new util.Symbol("len");
  var add = new util.Symbol("+");
  var sub = new util.Symbol("-");
  var mul = new util.Symbol("*");
  var div = new util.Symbol("/");
  var mod = new util.Symbol("%");
  var inc = new util.Symbol("++");
  var dec = new util.Symbol("--");
  var eq = new util.Symbol("=");
  var lt = new util.Symbol("<");
  var gt = new util.Symbol(">");
  var isNil = new util.Symbol("nil?");
  var isAtom = new util.Symbol("atom?");
  var isList = new util.Symbol("list?");
  var isZero = new util.Symbol("zero?");
  var ifthen = new util.Symbol("if");
  var cond = new util.Symbol("cond");
  var condElse = new util.Symbol("else");
  var reduce = new util.Symbol("reduce");
  var apply = new util.Symbol("apply");
  var map = new util.Symbol("map");
  var evil = new util.Symbol("eval");
  var a = new util.Symbol("a");
  var b = new util.Symbol("b");
  var c = new util.Symbol("c");

  describe("Environment tests", function() {
    it("def", function() {
      var en = Object.create(env);

      expect(e.call(en, [def, a, 5])).toEqual([]);
      expect(en.a).toEqual(5);
    });

    it("Arithmetic operators", function() {
      expect(e.call(env, [add, 3, 5, 7])).toEqual(3 + 5 + 7);
      expect(e.call(env, [sub, 3, 5, 7])).toEqual(3 - 5 - 7);
      expect(e.call(env, [mul, 3, 5, 7])).toEqual(3 * 5 * 7);
      expect(e.call(env, [div, 3, 5, 7])).toEqual(3 / 5 / 7);
      expect(e.call(env, [mod, 7, 5, 3])).toEqual(7 % 5 % 3);
      expect(e.call(env, [inc, 3])).toEqual(3 + 1);
      expect(e.call(env, [dec, 3])).toEqual(3 - 1);
    });

    it("fn", function() {
      var fnExpr = e.call(env, [fn, [], 4]);

      expect(typeof fnExpr).toEqual("function");
      expect(fnExpr.call(this)).toEqual(4);
      expect(e.call(env, [fnExpr])).toEqual(4);

      fnExpr = e.call(env, [fn, [a], [add, a, 2]]);
      expect(e.call(env, [fnExpr, 2])).toEqual(4);
      // making sure scoped names don't leak.
      expect(env.a).toBeUndefined();
    });

    it("defn", function() {
      var en = Object.create(env);
      e.call(en, [defn, a, [b, c], [add, b, c]]);

      expect(en.a).not.toBeUndefined();
      expect(typeof en.a).toEqual("function");
      expect(e.call(en, [a, 1, 2])).toEqual(3);
      // making sure scoped names don't leak.
      expect(en.b).toBeUndefined();
      expect(en.c).toBeUndefined();
    });

    it("quote", function() {
      var list = e.call(env, [quote, [fn, [a], [add, b, c]]]);

      expect(util.isList(list)).toEqual(true);
      expect(list).toEqual([fn, [a], [add, b, c]]);
    });

    it("let", function() {
      var result = e.call(env, [letvar, [[a, 3], [b, 4]], [add, a, b]]);

      expect(result).toEqual(7);
    });

    it("defmacro", function() {
      var en = Object.create(env);
      // a macro with an argument that evaluates to itself
      // acts just like its function counterpart.
      e.call(en, [defmacro, a, [b, c], [add, b, c]]);

      expect(en.a).not.toBeUndefined();
      expect(typeof en.a).toEqual("function");
      expect(e.call(en, [a, 1, 2])).toEqual(3);
      // making sure scoped names don't leak.
      expect(en.b).toBeUndefined();
      expect(en.c).toBeUndefined();

      // do it again... with a list as an argument.
      e.call(en, [defmacro, a, [b], b]);

      expect(en.a).not.toBeUndefined();
      expect(typeof en.a).toEqual("function");
      expect(e.call(en, [a, [1, 2]])).toEqual([1,2]);
      // making sure scoped names don't leak.
      expect(en.b).toBeUndefined();
    });

    it("list", function() {
      var list = e.call(env, [makelist, 1, 2, 3]);
      expect(list).toEqual([1, 2, 3]);

      list = e.call(env, [makelist, 1, [[fn, [], 2]]]);
      expect(list).toEqual([1, 2]);

      list = e.call(env, [makelist]);
      expect(list).toEqual([]);
    });

    it("cons", function() {
      var list = e.call(env, [cons, 3, []]);
      expect(list).toEqual([3]);

      list = e.call(env, [cons, 2, [makelist, 3]]);
      expect(list).toEqual([2, 3]);

      list = e.call(env, [cons, [makelist, 1], [makelist, 2, 3]]);
      expect(list).toEqual([[1], 2, 3]);
    });

    it("first", function() {
      var elem = e.call(env, [first, [makelist, 1, 2, 3]]);
      expect(elem).toEqual(1);
    });

    it("rest", function() {
      var elem = e.call(env, [rest, [makelist, 1, 2, 3]]);
      expect(elem).toEqual([2, 3]);

      elem = e.call(env, [rest, [makelist, 1]]);
      expect(elem).toEqual([]);
    });

    it("concat", function() {
      var list = e.call(env, [concat, [makelist, 3], []]);
      expect(list).toEqual([3]);

      list = e.call(env, [concat, [makelist, 3], [makelist, 4]]);
      expect(list).toEqual([3, 4]);

      list = e.call(env, [concat, [makelist, 3], [makelist, 4], [makelist, 4]]);
      expect(list).toEqual([3, 4, 4]);

      list = e.call(env, [concat, [makelist, 3, [makelist, 4]], [makelist, 4]]);
      expect(list).toEqual([3, [4], 4]);
    });

    it("len", function() {
      var l = e.call(env, [len, [makelist, 1, 2, 3, 4]]);
      expect(l).toEqual(4);
      expect(e.call(env, [len, []])).toEqual(0);
    });

    it("range", function() {
      expect(e.call(env, [range, 4])).toEqual([0, 1, 2, 3]);
      expect(e.call(env, [range, 1, 4])).toEqual([1, 2, 3]);
      expect(e.call(env, [range, 0, 20, 5])).toEqual([0, 5, 10, 15]);
    });

    it("=", function() {
      expect(e.call(env, [eq, 3, 3])).toEqual(3 === 3);
      expect(e.call(env, [eq, 3, 3, 3])).toEqual(3 === 3);
      expect(e.call(env, [eq, 3, 4])).toEqual(3 === 4);

      expect(e.call(env, [eq, [], []])).toEqual(true);
      expect(e.call(env,
        [eq,
          [makelist, 1, 2],
          [makelist, 1, 2]])).toEqual(true);
      expect(e.call(env,
        [eq,
          [makelist, 1, 2, 3],
          [makelist, 1, 2]])).toEqual(false);
      expect(e.call(env,
        [eq,
          [makelist, 1, 2, 3],
          [makelist, 1, 2, 4]])).toEqual(false);
    });

    it(">", function() {
      expect(e.call(env, [gt, 3, 3])).toEqual(false);
      expect(e.call(env, [gt, 3, 4])).toEqual(false);
      expect(e.call(env, [gt, 4, 3])).toEqual(true);
      expect(e.call(env, [gt, 4, 3, 2, 1])).toEqual(true);
      expect(e.call(env, [gt, 4, 3, 2, 5])).toEqual(false);
    });

    it("<", function() {
      expect(e.call(env, [lt, 3, 3])).toEqual(false);
      expect(e.call(env, [lt, 3, 4])).toEqual(true);
      expect(e.call(env, [lt, 4, 3])).toEqual(false);
      expect(e.call(env, [lt, 1, 2, 3, 4])).toEqual(true);
      expect(e.call(env, [lt, 1, 2, 3, 0])).toEqual(false);
    });

    it("nil?", function() {
      expect(e.call(env, [isNil, []])).toEqual(true);
      expect(e.call(env, [isNil, [makelist, 1]])).toEqual(false);
      expect(e.call(env, [isNil, 1])).toEqual(false);
      expect(e.call(env, [isNil, true])).toEqual(false);
    });

    it("atom?", function() {
      expect(e.call(env, [isAtom, []])).toEqual(false);
      expect(e.call(env, [isAtom, [makelist, 1]])).toEqual(false);
      expect(e.call(env, [isAtom, 1])).toEqual(true);
      expect(e.call(env, [isAtom, true])).toEqual(true);
    });

    it("list?", function() {
      expect(e.call(env, [isList, []])).toEqual(true);
      expect(e.call(env, [isList, [makelist, 1]])).toEqual(true);
      expect(e.call(env, [isList, 1])).toEqual(false);
      expect(e.call(env, [isList, true])).toEqual(false);
    });

    it("zero?", function() {
      expect(e.call(env, [isZero, []])).toEqual(false);
      expect(e.call(env, [isZero, [makelist, 1]])).toEqual(false);
      expect(e.call(env, [isZero, 1])).toEqual(false);
      expect(e.call(env, [isZero, true])).toEqual(false);
      expect(e.call(env, [isZero, 0])).toEqual(true);
    });

    it("if", function() {
      var en = Object.create(env);
      expect(e.call(en, [ifthen, true, 1, 2])).toEqual(1);
      expect(e.call(en, [ifthen, false, 1, 2])).toEqual(2);
      // make sure the other path doesn't get eval
      e.call(en, [ifthen, false, [def, a, 1], 2]);
      expect(en.a).toBeUndefined();
    });

    it("cond", function() {
      var en = Object.create(env);
      expect(e.call(en, [cond])).toEqual([]);
      expect(e.call(en, [cond, [true, 1]])).toEqual(1);
      expect(e.call(en, [cond, [condElse, 1]])).toEqual(1);
      expect(e.call(en,
        [cond,
          [false, 1],
          [condElse, 2]])).toEqual(2);
    });

    it("reduce", function() {
      var func = function(a, b) { return a + b; };
      var expr = [reduce, func, [makelist, 1, 2, 3]];
      expect(e.call(env, expr)).toEqual(6);
    });

    it("map", function() {
      var func1 = function(x) { return x + 1; };
      var expr1 = [map, func1, [makelist, 1, 2, 3]];
      expect(e.call(env, expr1)).toEqual([2, 3, 4]);

      var func2 = function(x, y) { return x + y; };
      var expr2 = [map, func2, [makelist, 1, 2, 3], [makelist, 2, 3, 4]];
      expect(e.call(env, expr2)).toEqual([3, 5, 7]);

      var func3 = function(x, y, z) { return [x, y, z]; };
      var expr3 =
        [map, func3,
          [makelist, 1, 2],
          [makelist, 1, 2],
          [makelist, 1, 2]];
      expect(e.call(env, expr3)).toEqual([[1, 1, 1], [2, 2, 2]]);
    });

    it("apply", function() {
      var func = function(x, y, z) { return [x, y, z]; };
      var expr = [apply, func, [makelist, 1, 2, 3]];
      expect(e.call(env, expr)).toEqual([1, 2, 3]);
    });

    it("eval", function() {
      var func = function(x, y, z) { return [x, y, z]; };
      var expr = [func, 1, 2, 3];
      expect(e.call(env, expr)).toEqual([1, 2, 3]);
    });
  });
});
