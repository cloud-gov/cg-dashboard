var context = require.context("./test/unit", true, /.+\.spec\.jsx?$/);
context.keys().forEach(context);
module.exports = context;
