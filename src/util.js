define(function () {
  function Symbol(val) {
    this.val = val;
  }
  function isSymbol(val) {
    return (val instanceof Symbol);
  }
  function isList(val) {
    return (val instanceof Array);
  }
  function toString(form) {
    if (isSymbol(form)) {
      return form.val.toString();
    }
    if (isList(form)) {
      return "(" + form.map(toString).join(" ") + ")";
    }
    return form.toString();
  }
  function first(list) {
    return list[0];
  }
  function rest(list) {
    return list.slice(1);
  }
  function isNil(val) {
    return (val instanceof Array) && (val.length === 0);
  }
  return {
    Symbol: Symbol,
    first: first,
    rest: rest,
    isNil: isNil,
    isList: isList,
    isSymbol: isSymbol,
    toString: toString
  };
});
