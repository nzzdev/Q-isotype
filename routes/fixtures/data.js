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
  require(`${fixtureDataDirectory}/highlight-category-one-row.json`),
  require(`${fixtureDataDirectory}/show-acronym.json`),
  require(`${fixtureDataDirectory}/download-data.json`),
  require(`${fixtureDataDirectory}/svg-use-references.json`),
  require(`${fixtureDataDirectory}/show-legend.json`),
  require(`${fixtureDataDirectory}/hide-legend.json`),
  require(`${fixtureDataDirectory}/icons-on-one-row.json`),
  require(`${fixtureDataDirectory}/less-than-10-icons.json`),
  require(`${fixtureDataDirectory}/less-than-50-icons.json`),
  require(`${fixtureDataDirectory}/more-than-50-icons.json`),
  require(`${fixtureDataDirectory}/compare-isotypes-svg.json`),
  require(`${fixtureDataDirectory}/compare-isotypes-png.json`),
  require(`${fixtureDataDirectory}/compare-isotypes-no-icon.json`),
  require(`${fixtureDataDirectory}/compare-isotypes-iconsOneRow.json`)
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
