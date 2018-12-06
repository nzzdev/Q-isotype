const fixtureDataDirectory = "../../resources/fixtures/data";

// provide every fixture data file present in ../../resources/fixtures/data
// has to be in sync with files created in build task - see ../../tasks/build.js
const fixtureData = [
  require(`${fixtureDataDirectory}/svg-png-viz-color.json`),
  require(`${fixtureDataDirectory}/only-svg-sizes-viz-color.json`),
  require(`${fixtureDataDirectory}/only-svg-sizes-one-row.json`),
  require(`${fixtureDataDirectory}/only-png-no-sources.json`),
  require(`${fixtureDataDirectory}/only-png-no-sources-one-row.json`),
  require(`${fixtureDataDirectory}/svg-png-no-viz-color-no-source.json`),
  require(`${fixtureDataDirectory}/svg-png-viz-color-missing-icon.json`),
  require(`${fixtureDataDirectory}/svg-png-viz-color-no-legend-no-notes-one-source.json`),
  require(`${fixtureDataDirectory}/svg-png-viz-color-one-row-no-footer.json`),
  require(`${fixtureDataDirectory}/only-svg-with-width-and-height-data-floats.json`),
  require(`${fixtureDataDirectory}/svg-one-category-with-zero-value.json`),
  require(`${fixtureDataDirectory}/highlight-category.json`),
  require(`${fixtureDataDirectory}/show-acronym.json`),
  require(`${fixtureDataDirectory}/download-data.json`),
  require(`${fixtureDataDirectory}/svg-use-references.json`)
];

module.exports = {
  path: "/fixtures/data",
  method: "GET",
  options: {
    tags: ["api"],
    cors: true
  },
  handler: (request, h) => {
    return fixtureData;
  }
};
