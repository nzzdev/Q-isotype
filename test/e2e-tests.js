const fs = require("fs");
const Lab = require("lab");
const Code = require("code");
const Hapi = require("hapi");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const lab = (exports.lab = Lab.script());

const expect = Code.expect;
const before = lab.before;
const after = lab.after;
const it = lab.it;

const routes = require("../routes/routes.js");
process.env.IMAGE_SERVICE_URL =
  "https://q-images-staging-nzz-ch.global.ssl.fastly.net/{key}?width={width}&auto=webp";

let server;

before(async () => {
  try {
    server = Hapi.server({
      port: process.env.PORT || 3000,
      routes: {
        cors: true
      }
    });
    await server.register(require("inert"));
    server.route(routes);
  } catch (err) {
    expect(err).to.not.exist();
  }
});

after(async () => {
  await server.stop({ timeout: 2000 });
  server = null;
});

lab.experiment("basics", () => {
  it("starts the server", () => {
    expect(server.info.created).to.be.a.number();
  });

  it("is healthy", async () => {
    const response = await server.inject("/health");
    expect(response.payload).to.equal("ok");
  });
});

lab.experiment("schema route", () => {
  it("returns existing schema", async () => {
    const response = await server.inject(`/schema.json`);
    expect(response.statusCode).to.be.equal(200);
  });

  it("returns Not Found when requesting an inexisting schema", async () => {
    const response = await server.inject("/inexisting.json");
    expect(response.statusCode).to.be.equal(404);
  });
});

lab.experiment("stylesheets route", () => {
  it(
    "returns existing stylesheet with right cache control header",
    { plan: 2 },
    async () => {
      const filename = require("../styles/hashMap.json").default;
      const response = await server.inject(`/stylesheet/${filename}`);
      expect(response.statusCode).to.be.equal(200);
      expect(response.headers["cache-control"]).to.be.equal(
        "max-age=31536000, immutable"
      );
    }
  );

  it("returns Not Found when requesting an inexisting stylesheet", async () => {
    const response = await server.inject("/stylesheet/inexisting.123.css");
    expect(response.statusCode).to.be.equal(404);
  });
});

lab.experiment("locales route", () => {
  it("returns existing english translation", async () => {
    const response = await server.inject(`/locales/en/translation.json`);
    expect(response.statusCode).to.be.equal(200);
  });

  it("returns Not Found when requesting an inexisting translation", async () => {
    const response = await server.inject(
      "/locales/inexisting/translation.json"
    );
    expect(response.statusCode).to.be.equal(404);
  });
});

lab.experiment("rendering-info", () => {
  it("renders correct markup", async () => {
    const fixtureResponse = await server.inject("/fixtures/data");
    const fixtureData = fixtureResponse.result;
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: fixtureData[0],
        toolRuntimeConfig: {}
      }
    });
    expect(response.statusCode).to.be.equal(200);
    expect(response.result.markup).startsWith(
      `<div class="s-q-item q-isotype"`
    );
  });

  it("renders correct markup including svg without height attribute", async () => {
    const fixtureData = require(`${__dirname}/../resources/fixtures/data/only-svg-with-width-and-height-data-floats.json`);
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: fixtureData,
        toolRuntimeConfig: {}
      }
    });
    expect(response.statusCode).to.be.equal(200);
    expect(response.result.markup).to.not.match(/.*<svg[^>]*height="[\d]*".*/);
  });

  it("returns 400 if no payload is given", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/rendering-info/web"
    });
    expect(response.statusCode).to.be.equal(400);
  });

  it("returns 400 if no item is given in payload", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/rendering-info/web",
      payload: {
        toolRuntimeConfig: {}
      }
    });
    expect(response.statusCode).to.be.equal(400);
  });

  it("returns 400 if no toolRuntimeConfig is given in payload", async () => {
    const fixtureResponse = await server.inject("/fixtures/data");
    const fixtureData = fixtureResponse.result;
    const response = await server.inject({
      method: "POST",
      url: "/rendering-info/web",
      payload: {
        item: fixtureData[0]
      }
    });
    expect(response.statusCode).to.be.equal(400);
  });

  it("returns compiled stylesheet name", async () => {
    const fixtureResponse = await server.inject("/fixtures/data");
    const fixtureData = fixtureResponse.result;
    const filename = require("../styles/hashMap.json").default;
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: fixtureData[0],
        toolRuntimeConfig: {}
      }
    });
    expect(response.result.stylesheets[0].name).to.be.equal(filename);
  });
});

lab.experiment("highlight icons", () => {
  it("should highlight the legend", async () => {
    const response = await server.inject({
      url: "/rendering-info/web",
      method: "POST",
      payload: {
        item: require("../resources/fixtures/data/highlight-category.json"),
        toolRuntimeConfig: {}
      }
    });

    const dom = new JSDOM(response.result.markup);
    const legendContainer = dom.window.document.querySelectorAll(
      "div.q-isotype-legend-container"
    );

    expect(legendContainer[1].getAttribute("style")).to.be.equal(
      "opacity:0.65;"
    );
    expect(legendContainer[2].getAttribute("style")).to.be.equal(
      "opacity:0.65;"
    );
    expect(legendContainer[3].getAttribute("style")).to.be.equal(
      "opacity:0.65;"
    );
  });
});

lab.experiment("dynamic-enum", () => {
  it("returns columns displayed in options dropdown", async () => {
    const item = require("../resources/fixtures/data/highlight-category.json");
    const response = await server.inject({
      url: "/dynamic-enum/highlightColumn",
      method: "POST",
      payload: item
    });

    expect(response.result.enum).to.be.equals([null, 1, 2, 3, 4]);
    expect(response.result.enum_titles).to.be.equals([
      "keine",
      "Hoch",
      "Breit",
      "Quadratisch",
      "Viz Gelb"
    ]);
  });
});

lab.experiment("option-availability", () => {
  it("returns if option is displayed or not", async () => {
    const item = require("../resources/fixtures/data/highlight-category.json");
    const response = await server.inject({
      url: "/option-availability/highlightColumn",
      method: "POST",
      payload: item
    });

    expect(response.result.available).to.be.equals(true);
  });
});
