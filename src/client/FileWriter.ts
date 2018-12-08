const _ = require("underscore.string");

export class FileWriter {
  config: any;
  data: any;

  constructor(config = {}) {
    this.configure(config);
  }

  configure(config = {}) {
    this.config = config;
  }

  createFileContent(data: any = {}) {
    return `// missing File content creator for: ${data.name}`;
  }

  setData(data = {}) {
    this.data = data;
    return this;
  }

  dasherize(name: string) {
    // without prefix -
    return _.dasherize(name).replace("-", "");
  }
}
