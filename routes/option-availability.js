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
      let isAvailable = false;
      if (request.payload.data !== null && request.payload.data !== undefined) {
        if (request.payload.data[0].length > 2) {
          isAvailable = true;
        }
      }
      return {
        available: isAvailable
      };
    }

    return Boom.badRequest();
  }
};
