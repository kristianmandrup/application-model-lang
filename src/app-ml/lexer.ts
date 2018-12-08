import * as chevrotain from "chevrotain";
const { createToken, Lexer } = chevrotain;

const True = createToken({ name: "True", pattern: /true/ });
const False = createToken({ name: "False", pattern: /false/ });
const Null = createToken({ name: "Null", pattern: /null/ });
const LCurly = createToken({ name: "LCurly", pattern: /{/ });
const RCurly = createToken({ name: "RCurly", pattern: /}/ });
const LSquare = createToken({ name: "LSquare", pattern: /\[/ });
const RSquare = createToken({ name: "RSquare", pattern: /]/ });
const Comma = createToken({ name: "Comma", pattern: /,/ });
const Colon = createToken({ name: "Colon", pattern: /:/ });
const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ });

const Application = createToken({
  name: "Application",
  pattern: /application/,
  longer_alt: Identifier
});
const Extends = createToken({
  name: "Extends",
  pattern: /extends/,
  longer_alt: Identifier
});
const Fields = createToken({
  name: "Fields",
  pattern: /fields/,
  longer_alt: Identifier
});
const Domains = createToken({
  name: "Domains",
  pattern: /domains/,
  longer_alt: Identifier
});

// ...

const Dot = createToken({ name: "Dot", pattern: /\./ });
const Anchor = createToken({ name: "Anchor", pattern: /#/ });

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

export const tokens = [
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
  Null,
  Identifier,
  Dot,
  Anchor,
  Application,
  Extends,
  Domains,
  Fields
];

export const tokenMap: any = {
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
  Null,
  Identifier,
  Dot,
  Anchor,
  Application,
  Extends,
  Domains,
  Fields
};

export const AppMlLexer = new Lexer(tokens, {
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
