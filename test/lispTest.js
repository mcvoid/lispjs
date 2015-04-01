define(["src/lisp", "src/util"], function(lisp, util) {
  describe("Lisp integration tests", function () {
    it("Interface tests", function() {
      expect(lisp.read).not.toBeUndefined();
      expect(lisp.eval).not.toBeUndefined();
      expect(lisp.print).not.toBeUndefined();
      expect(lisp.read instanceof Function).toEqual(true);
      expect(lisp.eval instanceof Function).toEqual(true);
      expect(lisp.print instanceof Function).toEqual(true);
    });
    it("Read -> eval -> tests", function() {
      var fn = new util.Symbol("fn");
      var x = new util.Symbol("x");
      var plus = new util.Symbol("+");

      var str = "((fn (x) (+ x 1)) 1)";
      var form = [[fn, [x], [plus, x, 1]], 1];
      lisp.read(str, function (x) {
        expect(x).toEqual(form);
        expect(lisp.eval(x)).toEqual(2);
        expect(lisp.print(lisp.eval(x))).toEqual("2");
      });
    });

    it("factorial", function() {
      var fact = "((fn (x) (if (zero? x) 1 (* x (recur (-- x))))) 4)";
      lisp.read(fact, function (x) {
        expect(lisp.eval(x)).toEqual(24);
      });
    });
  });
});
