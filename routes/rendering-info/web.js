const Boom = require("boom");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const parseString = require("xml2js").parseString;

const stylesDir = path.join(__dirname, "/../../styles/");
const styleHashMap = require(path.join(stylesDir, "hashMap.json"));

// setup nunjucks
const nunjucks = require("nunjucks");
const nunjucksEnv = new nunjucks.Environment();

const viewsDir = path.join(__dirname, "/../../views/");
const maxWidth = "40";

const schemaString = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../resources/", "schema.json"), {
    encoding: "utf-8"
  })
);
const Ajv = require("ajv");
const ajv = new Ajv();

ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-04.json"));

const validate = ajv.compile(schemaString);
function validateAgainstSchema(item, options) {
  if (validate(item)) {
    return item;
  } else {
    throw Boom.badRequest(JSON.stringify(validate.errors));
  }
}

async function validatePayload(payload, options, next) {
  if (typeof payload !== "object") {
    return next(Boom.badRequest(), payload);
  }
  if (typeof payload.item !== "object") {
    return next(Boom.badRequest(), payload);
  }
  if (typeof payload.toolRuntimeConfig !== "object") {
    return next(Boom.badRequest(), payload);
  }
  await validateAgainstSchema(payload.item, options);
}

function getIntegerValues(data) {
  return data.map((row, rowIndex) => {
    // keep header row as it is
    if (rowIndex === 0) {
      return row;
    }
    return row.map((cell, cellIndex) => {
      // keep first column as it is -> defines single entries
      if (cellIndex === 0) {
        return cell;
      }
      if (cell === null) {
        return null;
      }
      return parseInt(cell);
    });
  });
}

function getResizeImageUrl(image) {
  return process.env.IMAGE_SERVICE_URL.replace("{key}", image.key).replace(
    "{width}",
    maxWidth
  );
}

var attrToLowerCase = function(name) {
  return name.toLowerCase();
};

function getSvgSizeStyle(svg) {
  return new Promise((resolve, reject) => {
    parseString(
      svg,
      {
        strict: false,
        attrkey: "ATTR",
        attrNameProcessors: [attrToLowerCase]
      },
      (err, result) => {
        if (err) {
          reject(err);
        }

        if (!result.SVG.ATTR["viewbox"]) {
          reject("no viewbox defined in svg");
        }

        const hasWidthHeightAttr =
          result.SVG.ATTR["width"] && result.SVG.ATTR["height"];
        let height;
        let width;
        try {
          if (hasWidthHeightAttr) {
            height = parseInt(result.SVG.ATTR["height"]);
            width = parseInt(result.SVG.ATTR["width"]);
          } else {
            width = parseInt(
              result.SVG.ATTR["viewbox"]
                .toString()
                .replace(/^\d+\s\d+\s(\d+\.?[\d])\s(\d+\.?[\d])/, "$1")
            );
            height = parseInt(
              result.SVG.ATTR["viewbox"]
                .toString()
                .replace(/^\d+\s\d+\s(\d+\.?[\d])\s(\d+\.?[\d])/, "$2")
            );
          }
          if (height > width) {
            resolve("height: 100%");
          } else {
            resolve("width: 100%");
          }
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

module.exports = {
  method: "POST",
  path: "/rendering-info/web",
  options: {
    validate: {
      options: {
        allowUnknown: true
      },
      payload: validatePayload
    }
  },
  handler: async function(request, h) {
    const item = request.payload.item;

    item.data = getIntegerValues(item.data);

    let categories = [];
    if (item.data && item.data[0].length > 1) {
      categories = item.data[0].slice(1);
    }

    let sumAmounts = [];
    item.data.slice(1).forEach(entry => {
      sumAmounts.push(
        entry.slice(1).reduce((acc, current) => {
          return acc + current;
        }, 0)
      );
    });

    const maxAmount = Math.max(...sumAmounts);
    item.maxAmount = 100 / maxAmount;

    if (item.icons) {
      await Promise.all(
        item.icons.map(async icon => {
          try {
            const response = await fetch(icon.file.url);
            if (
              response.ok &&
              response.headers.get("content-type") === "image/svg+xml"
            ) {
              icon.svg = await response.text();
              try {
                icon.style = await getSvgSizeStyle(icon.svg);
              } catch (err) {
                // fallback to background image and delete icon.svg?
              }
            }
          } catch (err) {
            console.log(err);
          }
          icon.url = getResizeImageUrl(icon.file);
          delete icon.file;
          return icon;
        })
      );
    }

    const context = {
      item: item,
      categories: categories
    };

    const renderingInfo = {
      polyfills: ["Promise"],
      stylesheets: [
        {
          name: styleHashMap["default"]
        }
      ],
      markup: nunjucksEnv.render(viewsDir + "isotype.html", context)
    };

    return renderingInfo;
  }
};
