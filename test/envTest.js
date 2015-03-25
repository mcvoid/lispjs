define([
  "underscore",
  "src/util",
  "src/eval",
  "src/env"
], function(_, util, e, env) {
  describe("Environment tests", function() {
    it("def", function() {
      var en = _.clone(env);
      var code = [new util.Symbol("def"), new util.Symbol("a"), 5];
      expect(e.call(en, code)).toEqual([]);
      expect(en.a).toEqual(5);
    });
  });
});
