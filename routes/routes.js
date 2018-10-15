module.exports = [
  require("./rendering-info/web.js"),
  require("./stylesheet.js"),
  require("./health.js"),
  require("./locales.js"),
  require("./fixtures/data.js"),
  require("./option-availability.js"),
  require("./dynamic-enum.js")
].concat(require("./schema.js"));
