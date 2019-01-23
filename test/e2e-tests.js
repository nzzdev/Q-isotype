const Lab = require("lab");
const Code = require("code");
const Hapi = require("hapi");
const lab = (exports.lab = Lab.script());

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

lab.experiment("schema endpoint", () => {
  it("returns 200 for /schema.json", async () => {
    const response = await server.inject("/schema.json");
    expect(response.statusCode).to.be.equal(200);
  });
});

lab.experiment("locales endpoint", () => {
  it("returns 200 for en translations", async () => {
    const request = {
      method: "GET",
      url: "/locales/en/translation.json"
    };
    const response = await server.inject(request);
    expect(response.statusCode).to.be.equal(200);
  });
  it("returns 200 for fr translations", async () => {
    const request = {
      method: "GET",
      url: "/locales/fr/translation.json"
    };
    const response = await server.inject(request);
    expect(response.statusCode).to.be.equal(200);
  });
});

lab.experiment("stylesheets endpoint", () => {
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

lab.experiment("rendering-info endpoint", () => {
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
});

lab.experiment("dynamic-enum", () => {
  it("returns columns displayed in options dropdown", async () => {
    const item = require("../resources/fixtures/data/highlight-category.json");
    const response = await server.inject({
      url: "/dynamic-enum/highlightColumn",
      method: "POST",
      payload: { item: item }
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
      payload: { item: item }
    });

    expect(response.result.available).to.be.equals(true);
  });
});

lab.experiment("download data", () => {
  it("should return a csv file", async () => {
    const item = require("../resources/fixtures/data/download-data.json");
    const response = await server.inject({
      url: "/data",
      method: "POST",
      payload: {
        item: item
      }
    });
    expect(response.headers["content-disposition"]).to.be.equals(
      "attachment; filename=isotype-FIXTURE:-Download-data.csv"
    );
  });

  it("should return data in a csv format", async () => {
    const item = require("../resources/fixtures/data/download-data.json");
    const response = await server.inject({
      url: "/data",
      method: "POST",
      payload: {
        item: item
      }
    });
    expect(response.result.length).to.be.equals(95);
  });
});

lab.experiment("fixture data endpoint", () => {
  it("returns 16 fixture data items for /fixtures/data", async () => {
    const response = await server.inject("/fixtures/data");
    expect(response.statusCode).to.be.equal(200);
    expect(response.result.length).to.be.equal(16);
  });
});
