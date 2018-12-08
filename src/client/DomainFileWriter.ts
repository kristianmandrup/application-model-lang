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
