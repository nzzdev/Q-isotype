const Boom = require("boom");
const Joi = require("joi");

function getHighlightEnum(data) {
  if (data.item.data.length < 1) {
    return [null];
  }
  // constructs an array like [null,1,2,3,4,...] with as many indexes as there are data columns
  // the index is +1 because the first row of the data is always text and not displayed as isotype
  return [null]
    .concat([...data.item.data[0].slice(1).keys()])
    .map(index => (index !== null ? (index = index + 1) : index));
}

function getHighlightEnumTitles(data) {
  if (data.item.data.length < 1) {
    return ["keine"];
  }
  return ["keine"].concat(data.item.data[0].slice(1));
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
        enum: getHighlightEnum(request.payload),
        enum_titles: getHighlightEnumTitles(request.payload)
      };
    }
    return Boom.badRequest();
  }
};
