import * as chevrotain from "chevrotain";

(function jsonGrammarOnlyExample() {
  // ----------------- Lexer -----------------
  const createToken = chevrotain.createToken;
  const Lexer = chevrotain.Lexer;

  const True = createToken({ name: "True", pattern: /true/ });
  const False = createToken({ name: "False", pattern: /false/ });
  const Null = createToken({ name: "Null", pattern: /null/ });
  const LCurly = createToken({ name: "LCurly", pattern: /{/ });
  const RCurly = createToken({ name: "RCurly", pattern: /}/ });
  const LSquare = createToken({ name: "LSquare", pattern: /\[/ });
  const RSquare = createToken({ name: "RSquare", pattern: /]/ });
  const Comma = createToken({ name: "Comma", pattern: /,/ });
  const Colon = createToken({ name: "Colon", pattern: /:/ });
  const StringLiteral = createToken({
    name: "StringLiteral",
    pattern: /"(:?[^\\"\n\r]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/
  });
  const NumberLiteral = createToken({
    name: "NumberLiteral",
    pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
  });
  const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: Lexer.SKIPPED
  });

  const jsonTokens = [
    WhiteSpace,
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
    Null
  ];

  const JsonLexer = new Lexer(jsonTokens, {
    // Less position info tracked, reduces verbosity of the playground output.
    positionTracking: "onlyStart"
  });

  // Labels only affect error messages and Diagrams.
  LCurly.LABEL = "'{'";
  RCurly.LABEL = "'}'";
  LSquare.LABEL = "'['";
  RSquare.LABEL = "']'";
  Comma.LABEL = "','";
  Colon.LABEL = "':'";

  // ----------------- parser -----------------
  const Parser = chevrotain.Parser;

  class JsonParser extends Parser {
    constructor() {
      super(jsonTokens, {
        recoveryEnabled: true
      });

      const $: any = this;

      $.RULE("json", () => {
        $.OR([
          { ALT: () => $.SUBRULE($.object) },
          { ALT: () => $.SUBRULE($.array) }
        ]);
      });

      $.RULE("object", () => {
        $.CONSUME(LCurly);
        $.MANY_SEP({
          SEP: Comma,
          DEF: () => {
            $.SUBRULE($.objectItem);
          }
        });
        $.CONSUME(RCurly);
      });

      $.RULE("objectItem", () => {
        $.CONSUME(StringLiteral);
        $.CONSUME(Colon);
        $.SUBRULE($.value);
      });

      $.RULE("array", () => {
        $.CONSUME(LSquare);
        $.MANY_SEP({
          SEP: Comma,
          DEF: () => {
            $.SUBRULE($.value);
          }
        });
        $.CONSUME(RSquare);
      });

      $.RULE("value", () => {
        $.OR([
          { ALT: () => $.CONSUME(StringLiteral) },
          { ALT: () => $.CONSUME(NumberLiteral) },
          { ALT: () => $.SUBRULE($.object) },
          { ALT: () => $.SUBRULE($.array) },
          { ALT: () => $.CONSUME(True) },
          { ALT: () => $.CONSUME(False) },
          { ALT: () => $.CONSUME(Null) }
        ]);
      });

      // very important to call this after all the rules have been setup.
      // otherwise the parser may not work correctly as it will lack information
      // derived from the self analysis.
      this.performSelfAnalysis();
    }
  }

  // for the playground to work the returned object must contain these fields
  return {
    lexer: JsonLexer,
    parser: JsonParser,
    defaultRule: "json"
  };
})();
