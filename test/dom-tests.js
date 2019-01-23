const Lab = require("lab");
const Code = require("code");
const Hapi = require("hapi");
const lab = (exports.lab = Lab.script());
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
process.env.IMAGE_SERVICE_URL =
  "https://q-images-staging-nzz-ch.global.ssl.fastly.net/{key}?width={width}&auto=webp";

const expect = Code.expect;
const before = lab.before;
const after = lab.after;
const it = lab.it;

const routes = require("../routes/routes.js");

let server;

before(async () => {
  try {
    server = Hapi.server({
      port: process.env.PORT || 3000,
      routes: {
        cors: true
      }
    });
    server.route(routes);
  } catch (err) {
    expect(err).to.not.exist();
  }
});

after(async () => {
  await server.stop({ timeout: 2000 });
  server = null;
});

function element(markup, selector) {
  return new Promise((resolve, reject) => {
    const dom = new JSDOM(markup);
    resolve(dom.window.document.querySelector(selector));
  });
}

function elementCount(markup, selector) {
  return new Promise((resolve, reject) => {
    const dom = new JSDOM(markup);
    resolve(dom.window.document.querySelectorAll(selector).length);
  });
}

lab.experiment("highlight icons", () => {
  it("should highlight the first svg in legend", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/highlight-category.json"),
        toolRuntimeConfig: {}
      }
    });

    const dom = new JSDOM(response.result.markup);
    const svgs = dom.window.document.querySelectorAll(
      "div.q-isotype-legend-svg"
    );
    expect(svgs[0].getAttribute("class")).to.be.equals("q-isotype-legend-svg");
    expect(svgs[1].getAttribute("class")).to.be.equals(
      "q-isotype-legend-svg q-isotype-lowlight"
    );
    expect(svgs[2].getAttribute("class")).to.be.equals(
      "q-isotype-legend-svg q-isotype-lowlight"
    );
    expect(svgs[3].getAttribute("class")).to.be.equals(
      "q-isotype-legend-svg q-isotype-lowlight"
    );
  });
  it("should highlight the selected column when icons displayed on one row", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/highlight-category-one-row.json"),
        toolRuntimeConfig: {}
      }
    });

    const dom = new JSDOM(response.result.markup);
    const rows = dom.window.document.querySelectorAll("div.q-isotype-icon-row");
    expect(
      rows[0].getElementsByClassName("q-isotype-lowlight").length
    ).to.be.equals(11);
    expect(
      rows[1].getElementsByClassName("q-isotype-lowlight").length
    ).to.be.equals(7);
    expect(
      rows[2].getElementsByClassName("q-isotype-lowlight").length
    ).to.be.equals(11);
  });
});
