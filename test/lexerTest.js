define(["src/lexer"], function(Lexer) {
  describe("Lexer tests", function () {
    it("Lexer constructor exists", function(){
      expect(Lexer).toBeDefined();
      expect(typeof Lexer).toEqual("function");
    });
    it("Lexer correctly implements interface", function() {
      var l = new Lexer("a");
      expect(l.peek).toBeDefined();
      expect(typeof l.peek).toEqual("function");
      expect(l.next).toBeDefined();
      expect(typeof l.next).toEqual("function");
      expect(l.hasNext).toBeDefined();
      expect(typeof l.hasNext).toEqual("function");
    });
    it("Lexer tokenizes a number correctly", function() {
      var l = new Lexer("1");

      expect(l.hasNext()).toEqual(true);
      expect(l.peek()).toEqual("1");
      expect(l.next()).toEqual("1");
      expect(l.hasNext()).toEqual(false);
    });
    it("Lexer tokenizes all symbols correctly", function() {
      var l = new Lexer(" (1 23 4 5 ) ");
      expect(l.next()).toEqual("(");
      expect(l.next()).toEqual("1");
      expect(l.next()).toEqual("23");
      expect(l.next()).toEqual("4");
      expect(l.next()).toEqual("5");
      expect(l.next()).toEqual(")");
      expect(l.hasNext()).toEqual(false);
    });
    it("Lexer tokenizes quotes", function() {
      var l = new Lexer("'(1 2)");
      expect(l.next()).toEqual("'");
      expect(l.next()).toEqual("(");
      expect(l.next()).toEqual("1");
      expect(l.next()).toEqual("2");
      expect(l.next()).toEqual(")");
    });
  });
});
