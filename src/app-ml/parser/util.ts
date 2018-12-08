import { tokenMap } from "../lexer";
const { LCurly, RCurly, Comma, WhiteSpace, Identifier, Anchor } = tokenMap;

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const createUtil = ($: any) => {
  const createClause = (name: string, subRule: any) => {
    subRule = typeof subRule === "string" ? $[subRule] : subRule;
    $.RULE(name, () => {
      $.CONSUME(LCurly);
      // optional
      $.OPTION(() => {
        $.SUBRULE(subRule);
      });
      $.CONSUME(RCurly);
    });
  };

  const anchorId = () => {
    $.CONSUME(Identifier);
    // todo: optional Anchor
    $.OPTION(() => {
      $.CONSUME(Anchor);
      $.CONSUME(Identifier);
    });
  };

  const createDefClause = (name: string, token: any) =>
    $.RULE(name, () => {
      $.CONSUME(token);
      $.CONSUME(WhiteSpace);
      anchorId;
    });

  // use convention to enable iteration over collection
  const createDefClauses = (...names: string[]) =>
    names.map(name => {
      const className = capitalize(name);
      const token = tokenMap[className];
      createDefClause(`${name}Clause`, token);
    });

  const atLeastOne = (rule: any, sep = Comma) =>
    $.AT_LEAST_ONE_SEP({
      SEP: sep,
      DEF: () => {
        rule();
      }
    });

  const oneOrMore = (name: string, subRule: any, sep = Comma) =>
    $.RULE(name, () => {
      atLeastOne(() => $.CONSUME(subRule));
    });

  const eitherOf = (name: string, ...rules: any[]) =>
    $.RULE("appDef", () => {
      $.OR(
        rules.map(rule => {
          ALT: () => $.CONSUME(rule);
        })
      );
    });

  return {
    eitherOf,
    atLeastOne,
    oneOrMore,
    createDefClauses,
    createDefClause,
    anchorId,
    createClause
  };
};
