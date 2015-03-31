define(["underscore", "src/util", "src/eval"], function(_, util, e) {
  var defaultEnv = {
    "def": function (name, val) { // define a symbol
      this[name.val] = e.call(this, val) || [];
      return [];
    },
    "defn": function (name, params, body) {
      var newScope = Object.create(this);
      this[name.val] = newScope.recur = function() {
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
      this[name.val] = newScope.recur = function() {
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
      return [].slice.call(arguments).map(function(val) {
        return e.call(env, val);
      });
    },
    "cons": function(val, list) {
      var l = e.call(this, list);
      return [e.call(this, val)].concat(l);
    },
    "first": function(list) {
      var l = e.call(this, list);
      return util.first(l);
    },
    "rest": function(list) {
      var l = e.call(this, list);
      return util.rest(l);
    },
    "concat": function() {
      var args = [].slice.call(arguments).map(e.bind(this));
      return _.flatten(args, true);
    },
    "len": function(list) {
      var l = e.call(this, list);
      return (l instanceof Array) ? l.length : 0;
    },
    "range": function(start, stop, step) {
      if (!stop) { return _.range(start); }
      if (!step) { return _.range(start, stop); }
      return _.range(start, stop, step);
    },
    // tests
    "=": function () {
      var args = [].slice.call(arguments).map(e.bind(this));
      var a = args.shift();
      return args.map(function(b) {
        return _.isEqual(a, b);
      }).reduce(function (a, b) {
        return a && b;
      });
    },
    ">": function () {
      var env = this;
      var args = [].slice.call(arguments).map(function (a) {
        return e.call(env, a);
      });
      for (var i = 1; i < args.length; i++) {
        if (args[i - 1] <= args[i]) { return false; }
      }
      return true;
    },
    "<": function () {
      var env = this;
      var args = [].slice.call(arguments).map(function (a) {
        return e.call(env, a);
      });
      for (var i = 1; i < args.length; i++) {
        if (args[i - 1] >= args[i]) { return false; }
      }
      return true;
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
      var env = Object.create(this);
      env["else"] = true;
      var args = [].slice.call(arguments);
      var current;
      while (args.length > 0) {
        current = args.shift();
        if (!util.isList(current) || current.length !== 2) { return nil; }
        if (e.call(env, current[0])) {
          return e.call(env, current[1]);
        }
      }
      return [];
    },
    // function stuff
    "fn": function (params, body) { // a function literal
      var newScope = Object.create(this);
      newScope.recur = function() {
        var vals = [].slice.call(arguments);
        params.forEach(function(param, i) {
          newScope[param.val] = e.call(newScope, vals[i]);
        });
        return e.call(newScope, body);
      };
      return newScope.recur;
    },
    "reduce": function(func, list) {
      var l = e.call(this, list);
      l = l.reduce(func);
      return l;
    },
    "map": function map() {
      var args = [].slice.call(arguments);
      var results = [];
      var func = args.shift();
      args = args.map(e.bind(this));
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
      return func.apply(this, e.call(this, list));
    },
    "eval": function(form) {
      return e.call(this, e.call(this, form));
    }
  };
  return Object.create(defaultEnv);
});
