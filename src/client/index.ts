import * as path from "path";
import Seneca from "seneca";
import SenecaPromise from "seneca-promise";
const seneca = Seneca();

seneca.use(SenecaPromise);

import { createDomainFileWriter } from "./DomainFileWriter";

import { FileWriter } from "./FileWriter";

const service = {
  name: "reason-typeorm"
};

const fileWriterMap = {
  domain: createDomainFileWriter()
};

const fileWriters: FileWriter[] = Object.values(fileWriterMap);

export const createClient = (options = {}) => new ASTListener(options);

// TODO: generalise to make it easy to add custom AST listener by subclassing
export class ASTListener {
  constructor(options = {}) {
    this.configureAll(options);

    seneca.ready(() => {
      this.configure(this, options);
    });
  }

  get fileWriters() {
    return fileWriters;
  }

  configureAll(settings: any = {}) {
    this.fileWriters.map(writer => writer.configure(settings));
  }

  configure(ctx: any, options: any = {}) {
    seneca.addAsync(
      { role: "settings", cmd: "configure" },
      async (settings: any = {}) => {
        this.configureAll(settings);
        return await ctx.priorAsync({ settings: "configured", service });
      }
    );
  }

  subscribe(ctx: any) {
    seneca.addAsync({ role: "ast", cmd: "domain" }, async function({ data }) {
      const { domain } = fileWriterMap;
      // output domain file
      await domain.setData(data).writeFile();
      // reply domain file was outputted
      return await ctx.priorAsync({ domain: data.name, service });
    });
  }
}
