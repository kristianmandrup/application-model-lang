import * as chevrotain from "chevrotain";
import { tokens, tokenMap } from "../lexer";
const { Parser } = chevrotain;
import { createUtil } from "./util";
const {
  // WhiteSpace,
  NumberLiteral,
  StringLiteral,
  RCurly,
  LCurly,
  LSquare,
  RSquare,
  Comma,
  Colon,
  True,
  False,
  Null,
  // Identifier,
  // Dot,
  // Anchor,
  Application
  // Extends,
  // Domains,
  // Fields
} = tokenMap;

export const createAppMlParser = (config = {}) => new AppMlParser(config);

export class AppMlParser extends Parser {
  constructor(config = {}) {
    super(tokens, {
      recoveryEnabled: true,
      ...config
    });

    const $: any = this;
    const {
      anchorId,
      createScope,
      oneOrMore,
      eitherOf,
      createClauses
    } = createUtil($);

    $.RULE("appStatement", () => {
      $.CONSUME(Application);
      anchorId();
      // optional
      $.OPTION(() => {
        $.SUBRULE($.appScope);
      });
    });

    createScope("appScope", $.appDefinitions);

    eitherOf("appDef", $.extendsClause, $.fieldsClause, $.domainsClause);

    oneOrMore("appDefitions", $.appDef);

    createClauses("extends", "fields", "domains");

    // $.RULE("json", () => {
    //   $.OR([
    //     { ALT: () => $.SUBRULE($.object) },
    //     { ALT: () => $.SUBRULE($.array) }
    //   ]);
    // });

    // $.RULE("object", () => {
    //   $.CONSUME(LCurly);
    //   $.MANY_SEP({
    //     SEP: Comma,
    //     DEF: () => {
    //       $.SUBRULE($.objectItem);
    //     }
    //   });
    //   $.CONSUME(RCurly);
    // });

    // $.RULE("objectItem", () => {
    //   $.CONSUME(StringLiteral);
    //   $.CONSUME(Colon);
    //   $.SUBRULE($.value);
    // });

    // $.RULE("array", () => {
    //   $.CONSUME(LSquare);
    //   $.MANY_SEP({
    //     SEP: Comma,
    //     DEF: () => {
    //       $.SUBRULE($.value);
    //     }
    //   });
    //   $.CONSUME(RSquare);
    // });

    // $.RULE("value", () => {
    //   $.OR([
    //     { ALT: () => $.CONSUME(StringLiteral) },
    //     { ALT: () => $.CONSUME(NumberLiteral) },
    //     { ALT: () => $.SUBRULE($.object) },
    //     { ALT: () => $.SUBRULE($.array) },
    //     { ALT: () => $.CONSUME(True) },
    //     { ALT: () => $.CONSUME(False) },
    //     { ALT: () => $.CONSUME(Null) }
    //   ]);
    // });

    // very important to call this after all the rules have been setup.
    // otherwise the parser may not work correctly as it will lack information
    // derived from the self analysis.
    this.performSelfAnalysis();
  }
}
