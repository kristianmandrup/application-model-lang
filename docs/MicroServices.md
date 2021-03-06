# AST Micro services

We will use [SenecaJS](http://senecajs.org/getting-started/) to have a message based publish/subscribe micro services, where an AST visitor (langaueg server) can broadcast the AST to subscribing services.

The client services can use whatever language or library to listen for AST messages and respond.

- [Seneca Promise](https://github.com/tswaters/seneca-promise)
- [Seneca with Promises](http://senecajs.org/docs/tutorials/seneca-with-promises.html)

## AST client service

`FileWriter.ts`

```js
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
```

`DomainFileWriter.ts`

```js
import * as fs from "fs-extra";
import * as path from "path";
import { FileWriter } from "./FileWriter";

export const createDomainFileWriter = (config: any = {}) =>
  new DomainFileWriter(config);

export class DomainFileWriter extends FileWriter {
  configured: any;

  constructor(config = {}) {
    super(config);
  }

  get modelName() {
    return this.dasherize(this.data.name);
  }

  get defaults() {
    const dirPath = path.join(this.config.projRoot, "models");
    return {
      dirPath: () => dirPath,
      filePath: () => path.join(dirPath, this.modelName())
    };
  }

  get filePath() {
    return this.configured.filePath() || this.defaults.filePath();
  }

  get fileContent() {
    return this.createFileContent(this.data);
  }

  async writeFile() {
    await fs.writeFile(this.filePath, this.fileContent);
  }
}
```

`index.js`

```js
const path = require("path");
const Seneca = require("seneca");
const seneca = Seneca();
const SenecaPromise = require("seneca-promise");
seneca.use(SenecaPromise);

const FileWriter = require("./FileWriter");

const service = {
  name: "reason-typeorm"
};

const fileWriterMap = {
  domain: createDomainFileWriter()
};

const fileWriters = Object.values(fileWriterMap);

seneca.addAsync(
  { role: "settings", cmd: "configure" },
  async (settings, reply) => {
    const settings = settings;
    fileWriters.each(writer => writer.configure(settings));
    return await this.priorAsync({ settings: "configured", service });
  }
);

seneca.addAsync({ role: "ast", cmd: "domain" }, async ({ data }, reply) => {
  // output domain file

  // ...
  await fileWriters.domain.setData(data).writeFile();
  // reply domain file was outputted
  return await this.priorAsync({ domain: data.name, service });
});
```

## AST Server

```js
const Seneca = require("seneca");
const seneca = Seneca();
const SenecaPromise = require("seneca-promise");
seneca.use(SenecaPromise);

// data =
// {
//   type: 'domain',
//   name: 'Person'
//   fields: {
//     name: {
//       type: 'string'
//     }
//   }
// }

// triggered by AST domain node encountered
const onDomain = data => {
  try {
    const result = await seneca.actAsync({ role: "aml", cmd: "domain", data });
    handleResult(result);
  } catch (err) {
    handleError(err);
  }
};
```
