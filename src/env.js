define(["underscore", "src/util", "src/eval"], function(_, util, e) {
  return {
    "apply": function(func, list) { // call the func with the list as its args
      return e.call(this, [func].concat(list));
    },
    "eval": function(form) { // evaluate a list as if it's an s-expr
      return e.call(this, form);
    },
    "def": function (name, val) { // define a symbol
      this[name.val] = e.call(this, val) || [];
      return [];
    },
    "fn": function (params, body) { // a function literal
      var newScope = _.clone(this);
      return function() {
        var vals = [].slice.call(arguments);
        for (var i = 0; i < params.length; i++) {
          newScope[params[i]] = e.call(this, vals[i]);
        }
        e.call(body);
      };
    },
    "defn": function (name, params, body) {
      var newScope = _.clone(this);
      this[name.val] = function() {
        var vals = [].slice.call(arguments);
        for (var i = 0; i < params.length; i++) {
          newScope[params[i]] = e.call(this, vals[i]);
        }
        e.call(body);
      };
    },
    "defmacro": function (name, params, body) {
      var newScope = _.clone(this);
      this[name.val] = function() {
        var vals = [].slice.call(arguments);
        for (var i = 0; i < params.length; i++) {
          newScope[params[i]] = vals[i];
        }
        e.call(body);
      };
    },
    "quote": function(form) { // return the argument unevaluated.
      return form || nil;
    },
    // Arithmetic operators
    "+": function () {
      var env = this;
      var args = [].slice.call(arguments);
      return args.map(function(x) {
        return e.call(env, x);
      }).reduce(function (a, b) {
        return (a + b) || nil;
      });
    },
    "-": function () {
      var env = this;
      var args = [].slice.call(arguments);
      return args.map(function(x) {
        return e.call(env, x);
      }).reduce(function (a, b) {
        return (a - b) || nil;
      });
    },
    "*": function () {
      var env = this;
      var args = [].slice.call(arguments);
      return args.map(function(x) {
        return e.call(env, x);
      }).reduce(function (a, b) {
        return (a * b) || nil;
      });
    },
    "/": function () {
      var env = this;
      var args = [].slice.call(arguments);
      return args.map(function(x) {
        return e.call(env, x);
      }).reduce(function (a, b) {
        return (a / b) || nil;
      });
    },
    "%": function () {
      var env = this;
      var args = [].slice.call(arguments);
      return args.map(function(x) {
        return e.call(env, x);
      }).reduce(function (a, b) {
        return (a % b) || nil;
      });
    },
    "++": function (x) {
      return e.call(this, x) + 1;
    },
    "--": function (x) {
      return e.call(this, x) - 1;
    },
    // logical operators
    "and": function and() {
      var args = [].slice.call(arguments);
      if (args.length === 0) {
        return false;
      } else if (args.length === 1) {
        return e.call(this, args[0]) || false;
      }
      return e.call(this, args[0]) && and.call(this, util.rest(args));
    },
    "or": function or() {
      var args = [].slice.call(arguments);
      if (args.length === 0) {
        return false;
      } else if (args.length === 1) {
        return e.call(this, args[0]) || false;
      }
      return e.call(this, args[0]) || or.call(this, util.rest(args));
    },
    "not": function (val) {
        var eCond = (util.isNil(val)) ? false : e.call(this, val);
        return eCond ? false : true;
    },
    // list operators
    "list": function() {
      var env = this;
      return [].slice.call(arguments).map(function(i) {
        return e.call(env, i);
      });
    },
    "cons": function(val, list) {
      return [e.call(this, val)].concat(list);
    },
    "first": function(list) {
      return util.first(list);
    },
    "rest": function(list) {
      return util.rest(list);
    },
    "concat": function() {
      var args = [].slice.call(arguments);
      return first(args).concat.apply(rest(args));
    },
    "len": function(list) {
      return (list instanceof Array) ? list.length : 0;
    }
  };
});
/*

function conditional(cond, thenExpr, elseExpr) {
    var eCond = evaluate(cond);
    if (eCond && !isNil(cond)) { return evaluate(thenExpr); }
    return evaluate(elseExpr);
}

function eq() {
    var args = [].slice.call(arguments);
    var a = args.shift();
    if (a instanceof Array) { return false; }
    return args.map(function(b) {
        return a === b;
    }).reduce(function(a, b) {
        return a && b;
    });
}

function cond() {
    var args = [].slice.call(arguments);
    while (args.length >= 2) {
        var cond = args.shift();
        var then = args.shift();
        if (evaluate(cond)) { return evaluate(then); }
    }
    return nil;
}

builtins = {
    "=" : eq,
    "if": conditional,
    "cond": cond,
    "nil?": isNil,
    "list?": isList
};

var bootstrap = "" +
    // "(defn reduce (f l)" +
    // "      (cond (nil? l) nil" +
    // "            (nil? (rest l)) (first l)" +
    // "            else (reduce f (cons (f (first l) (second l))" +
    // "                                 (rest (rest l))))))" +
    // "(defn atom? (val)" +
    // "      (not (list? val)))" +
    "";
*/
