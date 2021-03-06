const Boom = require("@hapi/boom");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const UglifyJS = require("uglify-js");

const stylesDir = path.join(__dirname, "/../../styles/");
const styleHashMap = require(path.join(stylesDir, "hashMap.json"));

const viewsDir = path.join(__dirname, "/../../views/");
const renderingInfoScripts = require("../../helpers/renderingInfoScript.js");
const maxWidth = "40";

// setup svelte
require("svelte/register");
const staticTemplate = require(viewsDir + "StaticHtml.svelte").default;

const noIconDefault = require("../../resources/assets/no-icon-default.js");

const schemaString = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../resources/", "schema.json"), {
    encoding: "utf-8"
  })
);
const Ajv = require("ajv");
const ajv = new Ajv();

const validate = ajv.compile(schemaString);
function validateAgainstSchema(item, options) {
  if (validate(item)) {
    return item;
  } else {
    console.log("item not valid");
    throw Boom.badRequest(JSON.stringify(validate.errors));
  }
}

async function validatePayload(payload, options, next) {
  if (typeof payload !== "object") {
    console.log("payload not an object");
    return next(Boom.badRequest(), payload);
  }
  if (typeof payload.item !== "object") {
    console.log("item not an object");
    return next(Boom.badRequest(), payload);
  }
  if (typeof payload.toolRuntimeConfig !== "object") {
    console.log("toolRuntimeConfig not an object");
    return next(Boom.badRequest(), payload);
  }
  await validateAgainstSchema(payload.item, options);
}

function getRoundedValues(data) {
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
      return Math.round(cell);
    });
  });
}

function getSvgInfo(svg) {
  return new Promise((resolve, reject) => {
    const $ = cheerio.load(svg);
    const renderedSvg = $("svg")[0];
    if (!renderedSvg.attribs.viewBox) {
      reject("no viewBox defined in svg");
    }

    const hasWidthHeightAttr =
      renderedSvg.attribs.width && renderedSvg.attribs.height;
    let height;
    let width;
    // Firefox doesn't support gradient definitions inside symbols. Therefore we move all the definitions outside of the symbol. See bugzilla: https://bugzilla.mozilla.org/show_bug.cgi?id=353575
    let svgDefinitions;

    try {
      if ($("svg").has("defs")) {
        svgDefinitions = $.html("svg > defs");
      }
      if (hasWidthHeightAttr) {
        height = parseInt(renderedSvg.attribs.height, 10);
        width = parseInt(renderedSvg.attribs.width, 10);
      } else {
        width = parseInt(
          renderedSvg.attribs.viewBox
            .toString()
            .replace(/^\d+\s\d+\s(\d+\.?[\d])\s(\d+\.?[\d])/, "$1"),
          10
        );
        height = parseInt(
          renderedSvg.attribs.viewBox
            .toString()
            .replace(/^\d+\s\d+\s(\d+\.?[\d])\s(\d+\.?[\d])/, "$2"),
          10
        );
      }
      if (height === width) {
        resolve({
          hasHeight: height !== undefined,
          hasWidth: width !== undefined,
          aspectRatio: "square",
          svgDefinitions: svgDefinitions
        });
      } else if (height > width) {
        resolve({
          hasHeight: height !== undefined,
          hasWidth: width !== undefined,
          aspectRatio: "vertical",
          svgDefinitions: svgDefinitions
        });
      } else {
        resolve({
          hasHeight: height !== undefined,
          hasWidth: width !== undefined,
          aspectRatio: "horizontal",
          svgDefinitions: svgDefinitions
        });
      }
    } catch (err) {
      reject(err);
    }
  });
}

function getCleanedSvg(svg, svgInfo) {
  if (svgInfo.hasHeight) {
    // search in svg tag the height attribute and replace it with a space
    svg = svg.replace(/(<svg[^>]*)height="[\d]*"(.*)/, "$1 $2");
  }
  if (svgInfo.hasWidth) {
    // search in svg tag the width attribute and replace it with a space
    svg = svg.replace(/(<svg[^>]*)width="[\d]*"(.*)/, "$1 $2");
  }
  return svg;
}

function getAspectRatioFormat(aspectRatios) {
  if (
    aspectRatios.horizontal > 0 &&
    aspectRatios.vertical === 0 &&
    aspectRatios.square === 0
  ) {
    return "horizontal";
  } else if (
    aspectRatios.vertical > 0 &&
    aspectRatios.horizontal === 0 &&
    aspectRatios.square === 0
  ) {
    return "vertical";
  } else {
    return "square";
  }
}

function getResizeImageUrl(image) {
  return process.env.IMAGE_SERVICE_URL.replace("{key}", image.key).replace(
    "{width}",
    maxWidth
  );
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

    item.data = getRoundedValues(item.data);

    let categories = [];
    if (item.data && item.data[0].length > 1) {
      categories = item.data[0].slice(1);
    }

    let sumAmounts = [];
    // cutting off the header row as it contains no values just categories
    item.data.slice(1).forEach(entry => {
      sumAmounts.push(
        // cutting off the row title
        entry.slice(1).reduce((acc, current) => {
          return acc + current;
        }, 0)
      );
    });

    const maxAmount = Math.max(...sumAmounts);

    if (item.icons) {
      let aspectRatios = {
        square: 0,
        horizontal: 0,
        vertical: 0
      };
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
                const svgInfo = await getSvgInfo(icon.svg);
                aspectRatios[svgInfo.aspectRatio]++; // count the amount of aspectRatios
                if (svgInfo.hasHeight || svgInfo.hasWidth) {
                  icon.svg = getCleanedSvg(icon.svg, svgInfo);
                  icon.svgDefinitions = svgInfo.svgDefinitions;
                }
              } catch (err) {
                console.log(err);
                icon.svg = noIconDefault;
              }
            }
          } catch (err) {
            console.log(err);
          }
          icon.url = getResizeImageUrl(icon.file);
          icon.key = icon.file.key;
          delete icon.file;
          return icon;
        })
      );
      let aspectRatioFormat = getAspectRatioFormat(aspectRatios);
      item.icons.forEach(icon => {
        icon.aspectRatio = aspectRatioFormat;
      });
    }

    const context = {
      id: `q_isotype_${request.query._id}_${Math.floor(
        Math.random() * 100000
      )}`.replace(/-/g, ""),
      item: item,
      categories: categories,
      maxAmount: maxAmount,
      displayOptions: request.payload.toolRuntimeConfig.displayOptions || {}
    };

    if (item.allowDownloadData) {
      context.linkToCSV = `${request.payload.toolRuntimeConfig.toolBaseUrl}/data?appendItemToPayload=${request.query._id}`;
    }

    const renderingInfo = {
      polyfills: ["Promise"],
      stylesheets: [
        {
          name: styleHashMap["default"]
        }
      ],
      markup: staticTemplate.render(context).html,
      scripts: [
        {
          content: UglifyJS.minify(
            renderingInfoScripts.getMobileMinWidthScript(context)
          ).code
        }
      ]
    };

    return renderingInfo;
  }
};
