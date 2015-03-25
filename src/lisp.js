define([
    "src/eval",
    "src/read",
    "src/util",
    "src/env",
    "src/bootstrap"
], function (evaluate, read, util, env, bootstrap) {
    bootstrap();
    return {
        eval: evaluate.bind(env),
        read: read,
        print: util.toString,
        define: env.def.bind(env)
    };
});
