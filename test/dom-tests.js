const Lab = require("@hapi/lab");
const Code = require("@hapi/code");
const Hapi = require("@hapi/hapi");
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

function elements(markup, selector) {
  return new Promise((resolve, reject) => {
    const dom = new JSDOM(markup);
    resolve(dom.window.document.querySelectorAll(selector));
  });
}

function elementCount(markup, selector) {
  return new Promise((resolve, reject) => {
    const dom = new JSDOM(markup);
    resolve(dom.window.document.querySelectorAll(selector).length);
  });
}

lab.experiment("hide legend", () => {
  it("shows legend", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/show-legend.json"),
        toolRuntimeConfig: {}
      }
    });

    return element(response.result.markup, ".q-isotype-legend").then(
      element => {
        expect(element.style.length).to.be.equal(0);
      }
    );
  });
  it("hides legend", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/hide-legend.json"),
        toolRuntimeConfig: {}
      }
    });

    return elementCount(
      response.result.markup,
      ".q-isotype-hidden-legend"
    ).then(value => {
      expect(value).to.be.equal(1);
    });
  });
});

lab.experiment("show different icons next to each other", () => {
  it("shows all icons on a seperate row", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/show-legend.json"),
        toolRuntimeConfig: {}
      }
    });

    return elements(response.result.markup, "div.q-isotype-icon-row").then(
      elements => {
        expect(elements.length).to.be.equal(12);
        let iconContainers = elements[0].querySelectorAll(
          "div.q-isotype-icon-container"
        );
        expect(iconContainers.length).to.be.equal(10);
      }
    );
  });
  it("shows all icons next to each other", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/icons-on-one-row.json"),
        toolRuntimeConfig: {}
      }
    });

    return elements(response.result.markup, "div.q-isotype-icon-row").then(
      elements => {
        expect(elements.length).to.be.equal(3);
        let iconContainers = elements[0].querySelectorAll(
          "div.q-isotype-icon-container"
        );
        expect(iconContainers.length).to.be.equal(21);
      }
    );
  });
});

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

    return elements(response.result.markup, "div.q-isotype-legend-svg").then(
      elements => {
        expect(elements[0].getAttribute("class")).to.be.equals(
          "q-isotype-legend-svg"
        );
        expect(elements[1].getAttribute("class")).to.be.equals(
          "q-isotype-legend-svg q-isotype-lowlight"
        );
        expect(elements[2].getAttribute("class")).to.be.equals(
          "q-isotype-legend-svg q-isotype-lowlight"
        );
        expect(elements[3].getAttribute("class")).to.be.equals(
          "q-isotype-legend-svg q-isotype-lowlight"
        );
      }
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

    return elements(response.result.markup, "div.q-isotype-icon-row").then(
      elements => {
        expect(
          elements[0].getElementsByClassName("q-isotype-lowlight").length
        ).to.be.equals(11);
        expect(
          elements[1].getElementsByClassName("q-isotype-lowlight").length
        ).to.be.equals(7);
        expect(
          elements[2].getElementsByClassName("q-isotype-lowlight").length
        ).to.be.equals(11);
      }
    );
  });
});

lab.experiment("rounding", () => {
  it("should display rounded results", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/rounding.json"),
        toolRuntimeConfig: {}
      }
    });

    return elements(
      response.result.markup,
      "div.q-isotype-icon-container"
    ).then(elements => {
      expect(elements.length).to.be.equal(100);
    });
  });
});

lab.experiment("aspect ratios", () => {
  it("should display icons in horizontal icon-containers", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/aspect-ratio-horizontal.json"),
        toolRuntimeConfig: {}
      }
    });

    return elementCount(
      response.result.markup,
      "div.q-isotype-icon-container--horizontal"
    ).then(value => {
      expect(value).to.be.equals(4);
    });
  });

  it("should display icons in horizontal svgs", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/aspect-ratio-horizontal.json"),
        toolRuntimeConfig: {}
      }
    });

    return elementCount(
      response.result.markup,
      "div.q-isotype-icon-svg--horizontal"
    ).then(value => {
      expect(value).to.be.equals(4);
    });
  });

  it("should display icons in vertical icon-containers", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/aspect-ratio-vertical.json"),
        toolRuntimeConfig: {}
      }
    });

    return elementCount(
      response.result.markup,
      "div.q-isotype-icon-container--vertical"
    ).then(value => {
      expect(value).to.be.equals(4);
    });
  });

  it("should display icons in vertical svgs", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/aspect-ratio-vertical.json"),
        toolRuntimeConfig: {}
      }
    });

    return elementCount(
      response.result.markup,
      "div.q-isotype-icon-svg--vertical"
    ).then(value => {
      expect(value).to.be.equals(4);
    });
  });

  it("should display icons in square icon-containers", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/aspect-ratio-square.json"),
        toolRuntimeConfig: {}
      }
    });

    return elementCount(
      response.result.markup,
      "div.q-isotype-icon-container--square"
    ).then(value => {
      expect(value).to.be.equals(13);
    });
  });

  it("should display icons in square svgs", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/aspect-ratio-square.json"),
        toolRuntimeConfig: {}
      }
    });

    return elementCount(
      response.result.markup,
      "div.q-isotype-icon-svg--square"
    ).then(value => {
      expect(value).to.be.equals(13);
    });
  });
});

lab.experiment("countability", () => {
  it("should display countable when single row and less than 30 icons", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/single-entry-less-than-30.json"),
        toolRuntimeConfig: {}
      }
    });

    return elementCount(
      response.result.markup,
      "div.q-isotype-icon-container--square--is-countable"
    ).then(value => {
      expect(value).to.be.equals(29);
    });
  });

  it("should not display countable when single row and more than 30 icons", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/single-entry-more-than-30.json"),
        toolRuntimeConfig: {}
      }
    });

    return elementCount(
      response.result.markup,
      "div.q-isotype-icon-container--square--is-countable"
    ).then(value => {
      expect(value).to.be.equals(0);
    });
  });

  it("should display countable when compare categories and less than 100 icons", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/compare-categories.json"),
        toolRuntimeConfig: {}
      }
    });

    return elementCount(
      response.result.markup,
      "div.q-isotype-icon-container--square--is-countable"
    ).then(value => {
      expect(value).to.be.equals(25);
    });
  });

  it("should not display countable when compare groups and less than 100 icons", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/compare-groups-min-width.json"),
        toolRuntimeConfig: {}
      }
    });

    return elementCount(
      response.result.markup,
      "div.q-isotype-icon-container--square--is-countable"
    ).then(value => {
      expect(value).to.be.equals(0);
    });
  });

  it("should display countable when compare groups and less than 100 icons", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/compare-groups.json"),
        toolRuntimeConfig: {}
      }
    });

    return elementCount(
      response.result.markup,
      "div.q-isotype-icon-container--square--is-countable"
    ).then(value => {
      expect(value).to.be.equals(132);
    });
  });

  it("should not display countable when compare categories and less than 100 icons", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/compare-categories-min-width.json"),
        toolRuntimeConfig: {}
      }
    });

    return elementCount(
      response.result.markup,
      "div.q-isotype-icon-container--square--is-countable"
    ).then(value => {
      expect(value).to.be.equals(0);
    });
  });
});
