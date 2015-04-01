# lispjs

Lispjs is a simple lisp interpreter designed for experimental purposes.

## Features
* A reader, printer, and evaluator
* Supports numbers, symbols, booleans
* Lexical scoping
* Function literals, and simple macros (functions which don't `eval` their arguments first)
* Supports recursion, even in anonymous functions
* list operations (`list`, `cons`, `concat`, `first`, `rest`)
* Higher-order functions (`map`, `reduce`, `apply`)
* An environment that can be customized with javascript
* Clojure-ish syntax for easier typing
* `eval` keyword (take that, ClojureScript!)
* Extremely simple implementation

## Usage
```
require("src/lisp", function(lisp) {
  var code = "((fn (n) (if (zero? n) 1 (* n (recur (-- n))))) 4)";
  lisp.read(code, function(form) {
    var result = lisp.eval(form);
    console.log(lisp.print(result));
  });
});
```
  
## What it doesn't support (yet)
* Because I plan to work on it shortly
  * `do` (sequence of expressions)
  * `loop` (clojure-like iteration)
* Because I need a better lexer
  * Strings
  * Maps
  * short quoting (using `'`)
* Because I need a better evaluator
  * Tail recursion (need a trampoline mechanism built-in)
* Because it's low on my priority queue
  * `set!` (right now `def` can rewrite any binding in the current environment)
