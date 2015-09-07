var lisp = require("../src/lisp.js");
var util = require("../src/util.js");

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
    var r = lisp.read(str);
    expect(r).toEqual(form);
    expect(lisp.eval(r)).toEqual(2);
    expect(lisp.print(lisp.eval(r))).toEqual("2");
  });

  it("factorial", function() {
    var fact = "((fn (x) (if (zero? x) 1 (* x (recur (-- x))))) 4)";
    var x = lisp.read(fact);
    expect(lisp.eval(x)).toEqual(24);
  });

  it("quotes", function() {
    var q = "'(1 2 3)";
    var x = lisp.read(q);
    expect(lisp.eval(x)).toEqual([1, 2, 3]);
  });

  it("higher order functions", function() {
    var m = "(map ++ '(1 2 3))";
    var f = lisp.read(m);
    expect(lisp.eval(f)).toEqual([2, 3, 4]);

    m = "(apply + '(1 2 3))";
    f = lisp.read(m);
    expect(lisp.eval(f)).toEqual(6);

    m = "(reduce (fn (x y) (+ x y)) '(1 2 3))";
    f = lisp.read(m);
    expect(lisp.eval(f)).toEqual(6);
  });
});
