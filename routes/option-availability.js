const Boom = require("boom");
const Joi = require("joi");

module.exports = {
  method: "POST",
  path: "/option-availability/{optionName}",
  options: {
    validate: {
      payload: Joi.object()
    },
    cors: true
  },
  handler: function(request, h) {
    if (request.params.optionName === "highlightColumn") {
      return {
        available: request.payload.data && request.payload.data.length >= 2
      };
    }

    return Boom.badRequest();
  }
};
