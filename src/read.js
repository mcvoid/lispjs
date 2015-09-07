var util = require("./util");

var cmb = require("cmbjs");
var term = cmb.term;
var any = cmb.any;
var all = cmb.all;
var many = cmb.many;

var parse = cmb({
  grammar: {
    "value": any(
      "true",
      "false",
      "nil",
      "number",
      "symbol",
      "list",
      "quote",
      "string"
    ),
    "true": term("true"),
    "false": term("false"),
    "nil": term("nil"),
    "number": term(/-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/),
    "symbol": term(/[\w+\-*/?!<>=%\.]+/),
    "list": all(term("("), many("value"), term(")")),
    "quote": all(term("'"), "value"),
    "string": all(term("\""), term(/([^\"\\]*|\\(["\\\/bfnrt]{1}|u[a-f0-9]{4}))*/), term("\""))
  },
  startRule: "value",
  ignore: cmb.term(/[\s\,]+/),
  transforms: {
    "true": function() {
      return true;
    },
    "false": function() {
      return false;
    },
    "nil": function() {
      return [];
    },
    "number": function(v) {
      return parseFloat(v);
    },
    "symbol": function(v) {
      return new util.Symbol(v);
    },
    "list": function(v) {
      return v[1].value.map(function(a) {
        return a.value;
      });
    },
    "quote": function(v) {
      return [new util.Symbol("quote"), v[1].value];
    },
    "string": function(v) {
      return v[1].value;
    }
  }
});

module.exports = function(s) {
  var result = parse(s);
  if (result.err) { throw JSON.stringify(result.err, null, "  "); }
  return result.value;
};
