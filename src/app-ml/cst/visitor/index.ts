import { BaseVisitor, BaseVisitorWithDefaults } from "../..";

export class AmlCstVisitor extends BaseVisitor {
  constructor() {
    super();
    // The "validateVisitor" method is a helper utility which performs static analysis
    // to detect missing or redundant visitor methods
    this.validateVisitor();
  }

  /* Visit methods go here */
  // The Ctx argument is the current CSTNode's children.
  appClause(ctx) {
    // Each Terminal or Non-Terminal in a grammar rule are collected into
    // an array with the same name(key) in the ctx object.
    const name = ctx.Identifier;

    return {
      type: "APP_CLAUSE",
      name
    };
  }

  /* Visit methods go here */
  // The Ctx argument is the current CSTNode's children.
  domainsClause(ctx) {
    // Each Terminal or Non-Terminal in a grammar rule are collected into
    // an array with the same name(key) in the ctx object.
    const domains = ctx.Identifier.map(identToken => identToken.image);

    return {
      type: "DOMAINS_CLAUSE",
      domains
    };
  }
}

export class AmlCstVisitorWithDefaults extends BaseVisitorWithDefaults {
  constructor() {
    super();
    this.validateVisitor();
  }

  /* Visit methods go here */
}
