module.exports = {
  entry: "./src/lisp.js",
  output: {
    filename: "bundle.js",
    libraryTarget: "var",
    library: "lisp"
  }
};
