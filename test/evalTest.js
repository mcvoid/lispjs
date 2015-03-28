define(["src/util", "src/eval"], function(util, e) {
  var env = {
    "a": 5,
    "f": function() { return 3; },
    "list": [1, 2, 3]
  };
  var a = new util.Symbol("a");
  var list = new util.Symbol("list");
  var f = new util.Symbol("f");

  describe("Eval tests", function() {
    it("Eval existence", function() {
      expect(e).toBeDefined();
      expect(typeof e).toEqual("function");
    });
    var ee = e.bind(env);
    it("Eval an atom", function() {
      expect(ee(5)).toEqual(5);
      expect(ee(true)).toEqual(true);
      expect(ee([])).toEqual([]);
    });
    it("Eval a symbol", function() {
      expect(ee(a)).toEqual(5);
      expect(ee(list)).toEqual([1, 2, 3]);
    });
    it("Eval a list", function() {
      expect(ee([function(a, b) {
        return a + b;
      }, 2, 3])).toEqual(5);

      expect(ee([f])).toEqual(3);
    });
  });
});
