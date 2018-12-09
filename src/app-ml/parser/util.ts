import { tokenMap } from "../lexer";
const { LCurly, RCurly, Comma, WhiteSpace, Identifier, Tag } = tokenMap;

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const createUtil = ($: any) => {
  const createScope = (name: string, subRule: any) => {
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

  const tagId = () => {
    $.CONSUME(Identifier);
    // todo: optional Tag
    $.OPTION(() => {
      $.CONSUME(Tag);
      $.CONSUME(Identifier);
    });
  };

  const createClause = (name: string, token: any) =>
    $.RULE(name, () => {
      $.CONSUME(token);
      tagId;
    });

  // use convention to enable iteration over collection
  const createClauses = (...names: string[]) =>
    names.map(name => {
      const className = capitalize(name);
      const token = tokenMap[className];
      createClause(`${name}Clause`, token);
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
    $.RULE(name, () => {
      $.OR(
        rules.map(rule => ({
          ALT: () => $.CONSUME(rule)
        }))
      );
    });

  return {
    eitherOf,
    atLeastOne,
    oneOrMore,
    createClauses,
    createClause,
    createScope,
    tagId
  };
};
