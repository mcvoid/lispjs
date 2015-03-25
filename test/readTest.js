define(["src/util", "src/read"], function(util, read) {
  describe("Reader tests", function() {
    it("reader existence", function() {
      expect(read).toBeDefined();
      expect(typeof read).toEqual("function");
    });
    it("read atoms", function() {
      var result;
      read("10", function(val) { result = val; });
      expect(result).toEqual(10);
      read("-10.1", function(val) { result = val; });
      expect(result).toEqual(-10.1);
      read("abc123+!", function(val) { result = val; });
      expect(result).toEqual(new util.Symbol("abc123+!"));
      read("true", function(val) { result = val; });
      expect(result).toEqual(true);
      read("false", function(val) { result = val; });
      expect(result).toEqual(false);
      read("else", function(val) { result = val; });
      expect(result).toEqual(true);
    });
    it("read lists", function() {
      var result;
      read("nil", function(val) { result = val; });
      expect(result).toEqual([]);
      read("()", function(val) { result = val; });
      expect(result).toEqual([]);
      read("((3)(3))", function(val) { result = val; });
      expect(result).toEqual([[3],[3]]);
    });
    it("multiple expressions", function() {
      var result = {};
      read("3 4 5 nil", function(val) {
        result[val] = val;
        result.last = val;
      });
      expect(result[3]).toEqual(3);
      expect(result[4]).toEqual(4);
      expect(result[5]).toEqual(5);
      expect(result.last).toEqual([]);
    });
  });
});
