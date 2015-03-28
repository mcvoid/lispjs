define([
  "src/util",
  "src/eval",
  "src/env"
], function(util, e, env) {
  var def = new util.Symbol("def");
  var defn = new util.Symbol("defn");
  var fn = new util.Symbol("fn");
  var quote = new util.Symbol("quote")
  var add = new util.Symbol("+");
  var sub = new util.Symbol("-");
  var mul = new util.Symbol("*");
  var div = new util.Symbol("/");
  var mod = new util.Symbol("%");
  var inc = new util.Symbol("++");
  var dec = new util.Symbol("--");
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
      e.call(env, [defn, a, [b, c], [add, b, c]]);

      expect(env.a).not.toBeUndefined();
      expect(typeof env.a).toEqual("function");
      expect(e.call(env, [a, 1, 2])).toEqual(3);
      // making sure scoped names don't leak.
      expect(env.b).toBeUndefined();
      expect(env.c).toBeUndefined();
    });

    it("quote", function() {
      var list = e.call(env, [quote, [fn, [a], [add, b, c]]]);

      expect(util.isList(list)).toEqual(true);
    });
  });
});
