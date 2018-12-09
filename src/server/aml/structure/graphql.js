module.export = ({ name }) => ({
  dirName: `graphql/${name.dasherized}`,
  fileName: name.camelized
});
