var util = require("./util");
var nil = [];

module.exports = function evaluate(form) {
  if (util.isNil(form)) {
    return nil;
  }
  if (util.isList(form)) {
    var func = evaluate.call(this, util.first(form));
    var args = util.rest(form);
    return func.apply(this, args);
  }
  if (util.isSymbol(form)) {
    return this[form.val];
  }
  return form;
};
