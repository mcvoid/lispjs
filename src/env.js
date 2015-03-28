define(["underscore", "src/util", "src/eval"], function(_, util, e) {
  var defaultEnv = {
    "def": function (name, val) { // define a symbol
      this[name.val] = e.call(this, val) || [];
      return [];
    },
    "defn": function (name, params, body) {
      var newScope = Object.create(this);
      this[name.val] = function() {
        var vals = [].slice.call(arguments);
        params.forEach(function(param, i) {
          newScope[param.val] = e.call(newScope, vals[i]);
        });
        return e.call(newScope, body);
      };
      return [];
    },
    "defmacro": function (name, params, body) {
      var newScope = Object.create(this);
      this[name.val] = function() {
        var vals = [].slice.call(arguments);
        params.forEach(function(param, i) {
          newScope[param.val] = vals[i];
        });
        return e.call(newScope, body);
      };
      return [];
    },
    "quote": function(form) { // return the argument unevaluated.
      return form || [];
    },
    "let": function(bindings, body) {
      var env = Object.create(this);
      bindings.forEach(function (binding) {
        var sym = binding[0];
        var val = e.call(env, binding[1]);
        env[sym.val] = val;
      });
      return e.call(env, body);
    },
    // Arithmetic operators
    "+": function () {
      var env = this;
      var args = [].slice.call(arguments);
      return args.map(function(x) {
        return e.call(env, x);
      }).reduce(function (a, b) {
        return (a + b) || [];
      });
    },
    "-": function () {
      var env = this;
      var args = [].slice.call(arguments);
      return args.map(function(x) {
        return e.call(env, x);
      }).reduce(function (a, b) {
        return (a - b) || [];
      });
    },
    "*": function () {
      var env = this;
      var args = [].slice.call(arguments);
      return args.map(function(x) {
        return e.call(env, x);
      }).reduce(function (a, b) {
        return (a * b) || [];
      });
    },
    "/": function () {
      var env = this;
      var args = [].slice.call(arguments);
      return args.map(function(x) {
        return e.call(env, x);
      }).reduce(function (a, b) {
        return (a / b) || [];
      });
    },
    "%": function () {
      var env = this;
      var args = [].slice.call(arguments);
      return args.map(function(x) {
        return e.call(env, x);
      }).reduce(function (a, b) {
        return (a % b) || [];
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
    },
    // tests
    "=": function eq() {
      function equal(a, b) {
        if (a instanceof Array && b instanceof Array) {
          if (a.length !== b.length) {
            return false;
          }
          if (util.isNil(a)) {
            return true;
          }
          return equal(util.first(a), util.first(b)) &&
            equal(util.rest(a), util.rest(b));
        }
        return a === b;
      }
      var args = [].slice.call(arguments);
      var a = args.shift();
      a = e.call(this, a);
      return args.map(function(b) {
        return equal(a, e.call(this, b));
      }).reduce(function(a, b) {
        return a && b;
      });
    },
    "nil?": function(form) {
      return util.isNil(e.call(this, form));
    },
    "list?": function(form) {
      return util.isList(e.call(this, form));
    },
    "atom?": function(form) {
      return !util.isList(e.call(this, form));
    },
    "zero?": function(form) {
      return e.call(this, form) === 0;
    },
    // control structures
    "if": function(cond, then, other) {
      return e.call(this, cond) ? e.call(this, then) : e.call(this, other);
    },
    "cond": function() {
      var args = [].slice.call(arguments);
      var current;
      while (args.length > 0) {
        current = args.shift();
        if (!util.isList(current) || current.length !== 2) { return nil; }
        if (e.call(this, current[0])) {
          return e.call(this, current[2]);
        }
      }
      return [];
    },
    // function stuff
    "fn": function (params, body) { // a function literal
      var newScope = Object.create(this);
      return function() {
        var vals = [].slice.call(arguments);
        params.forEach(function(param, i) {
          newScope[param.val] = e.call(newScope, vals[i]);
        });
        return e.call(newScope, body);
      };
    },
    "reduce": function(func, list) {
      return e.call(this, list).reduce(func);
    },
    "map": function map() {
      var args = [].slice.call(arguments);
      var results = [];
      var func = args.shift();
      args.map(e.bind(this));
      while (_.min(args.map(function(list) {
        return list.length;
      })) > 0) {
        results.push(func.apply(this, args.map(function(list) {
          return list.shift();
        })));
      }
      return results;
    },
    "apply": function(func, list) {
      return e.call(this, [func].concat(list));
    },
    "eval": function(form) {
      return e.call(this, form);
    }
  };
  return Object.create(defaultEnv);
});
