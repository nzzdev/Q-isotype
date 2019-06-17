const fixtureDataDirectory = "../../resources/fixtures/data";

// provide every fixture data file present in ../../resources/fixtures/data
// has to be in sync with files created in build task - see ../../tasks/build.js
const fixtureData = [
  require(`${fixtureDataDirectory}/viz-color.json`),
  require(`${fixtureDataDirectory}/sizes-viz-color.json`),
  require(`${fixtureDataDirectory}/sizes-one-row.json`),
  require(`${fixtureDataDirectory}/no-viz-color-no-source.json`),
  require(`${fixtureDataDirectory}/viz-color-missing-icon.json`),
  require(`${fixtureDataDirectory}/viz-color-no-legend-no-notes-one-source.json`),
  require(`${fixtureDataDirectory}/viz-color-one-row-no-footer.json`),
  require(`${fixtureDataDirectory}/width-and-height-data-floats.json`),
  require(`${fixtureDataDirectory}/one-category-with-zero-value.json`),
  require(`${fixtureDataDirectory}/highlight-category.json`),
  require(`${fixtureDataDirectory}/highlight-category-one-row.json`),
  require(`${fixtureDataDirectory}/show-acronym.json`),
  require(`${fixtureDataDirectory}/download-data.json`),
  require(`${fixtureDataDirectory}/use-references.json`),
  require(`${fixtureDataDirectory}/show-legend.json`),
  require(`${fixtureDataDirectory}/hide-legend.json`),
  require(`${fixtureDataDirectory}/icons-on-one-row.json`),
  require(`${fixtureDataDirectory}/less-than-10-icons.json`),
  require(`${fixtureDataDirectory}/less-than-100-icons.json`),
  require(`${fixtureDataDirectory}/more-than-100-icons.json`),
  require(`${fixtureDataDirectory}/compare-isotypes.json`),
  require(`${fixtureDataDirectory}/compare-isotypes-no-icon.json`),
  require(`${fixtureDataDirectory}/compare-isotypes-iconsOneRow.json`),
  require(`${fixtureDataDirectory}/aspect-ratio-square.json`),
  require(`${fixtureDataDirectory}/aspect-ratio-horizontal.json`),
  require(`${fixtureDataDirectory}/aspect-ratio-vertical.json`),
  require(`${fixtureDataDirectory}/aspect-ratio-horizontal-alot.json`),
  require(`${fixtureDataDirectory}/aspect-ratio-vertical-alot.json`),
  require(`${fixtureDataDirectory}/aspect-ratio-mixed.json`)
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
