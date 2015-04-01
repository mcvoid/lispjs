define([
    "src/eval",
    "src/read",
    "src/util",
    "src/env",
], function (evaluate, read, util, env) {
    return {
        eval: evaluate.bind(env),
        read: read,
        print: util.toString,
        define: env.def.bind(env)
    };
});
