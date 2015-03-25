define(["src/util", "src/eval"], function(util, e) {
  var env = {
    "a": 5,
    "f": function() { return 3; },
    "nil": [1, 2, 3]
  };
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
      expect(ee(new util.Symbol("a"))).toEqual(5);
      expect(ee(new util.Symbol("nil"))).toEqual([1, 2, 3]);
    });
    it("Eval a list", function() {
      expect(ee([function(a, b) {
        return a + b;
      }, 2, 3])).toEqual(5);

      expect(ee([new util.Symbol("f")])).toEqual(3);
    });
  });
});
