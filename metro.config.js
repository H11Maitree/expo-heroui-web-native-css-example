const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);
const cssEntryFile = process.env.UNIWIND_CSS_ENTRY || "./native.css";

module.exports = withUniwindConfig(config, {
  cssEntryFile,
});