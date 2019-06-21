const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");

function getHighlightEnum(item) {
  if (item.data.length < 1) {
    return [null];
  }
  // constructs an array like [null,1,2,3,4,...] with as many indexes as there are data columns
  // the index is +1 because the first row of the data is always text and not displayed as isotype
  return [null]
    .concat([...item.data[0].slice(1).keys()])
    .map(index => (index !== null ? (index = index + 1) : index));
}

function getHighlightEnumTitles(item) {
  if (item.data.length < 1) {
    return ["keine"];
  }

  return ["keine"].concat(
    item.data[0]
      .slice(1)
      .map((title, index) =>
        title === null ? (title = `${index + 1}. Spalte`) : title
      )
  );
}

module.exports = {
  method: "POST",
  path: "/dynamic-enum/{optionName}",
  options: {
    validate: {
      payload: Joi.object()
    },
    cors: true
  },
  handler: function(request, h) {
    if (request.params.optionName === "highlightColumn") {
      return {
        enum: getHighlightEnum(request.payload.item),
        enum_titles: getHighlightEnumTitles(request.payload.item)
      };
    }
    return Boom.badRequest();
  }
};
