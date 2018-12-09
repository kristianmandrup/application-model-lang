module.export = ({ name }) => ({
  dirName: `domains/${name.dasherized}`,
  fileName: name.camelized
});
