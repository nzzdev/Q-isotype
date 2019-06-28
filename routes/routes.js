module.exports = [
  require("./rendering-info/web.js"),
  require("./stylesheet.js"),
  require("./health.js"),
  require("./locales.js"),
  require("./fixtures/data.js"),
  require("./option-availability.js"),
  require("./dynamic-schema.js"),
  require("./data.js")
].concat(require("./schema.js"));
