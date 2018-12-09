# Parser Generator

[chevrotain](https://github.com/SAP/chevrotain) by [SAP](https://github.com/SAP)

```
yarn add chevrotain
```

## Lexer

[Step 1: Lexing](https://sap.github.io/chevrotain/docs/tutorial/step1_lexing.html)

For the Lexer we need to define the set of valid tokens:

```js
const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ });

// We specify the "longer_alt" property to resolve keywords vs identifiers ambiguity.
// See: https://github.com/SAP/chevrotain/blob/master/examples/lexer/keywords_vs_identifiers/keywords_vs_identifiers.js

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

const Comma = createToken({ name: "Comma", pattern: /,/ });
const Colon = createToken({ name: "Colon", pattern: /:/ });
const LBrace = createToken({ name: "LBrace", pattern: /{/ });
const RBrace = createToken({ name: "RBrace", pattern: /}/ });
const LParens = createToken({ name: "LBrace", pattern: /\(/ });
const RParens = createToken({ name: "RBrace", pattern: /\)/ });
const Dot = createToken({ name: "Dot", pattern: /\./ });
const Tag = createToken({ name: "Tag", pattern: /#/ });

const Integer = createToken({ name: "Integer", pattern: /0|[1-9]\d*/ });

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: chevrotain.Lexer.SKIPPED
});
```

### List of Tokens

```js
// note we are placing WhiteSpace first as it is very common thus it will speed up the lexer.

const allTokens = [
  WhiteSpace,
  // "keywords" appear before the Identifier
  Application,
  Extends,
  Fields,
  Comma,
  Colon,
  LBrace,
  RBrace,
  LParens,
  RParens,
  Dot,
  Tag,
  // The Identifier must appear after the keywords because all keywords are valid identifiers.
  Identifier,
  Integer
];

const tokenMap = {
  WhiteSpace,
  // "keywords" appear before the Identifier
  Application,
  Extends,
  Fields,
  Comma,
  Colon,
  LBrace,
  RBrace,
  LParens,
  RParens,
  Dot,
  Tag,
  // The Identifier must appear after the keywords because all keywords are valid identifiers.
  Identifier,
  Integer
};

let AppMlLexer = new Lexer(allTokens);
```

```js
let inputText = `
  application {
      extends
      fields,
  }
`;
let lexingResult = AppMlLexer.tokenize(inputText);
```

## Parser

[Step 2: Parsing](https://sap.github.io/chevrotain/docs/tutorial/step2_parsing.html)

```
appStatement
  : "application" Identifier  (":" Identifier)? "{" appDef "}"

appClause
  : (extendsClause?, fieldsClause?, domainsClause? )*

extendsClause
  : "extends" Identifier ("#" Identifier)?

fieldsClause
  : "fields" Identifier ("#" Identifier)? ("{" fieldDef "}")?

domainsClause
  : "domains" Identifier ("#" Identifier)? ("{" domainsDef "}")?
```

### Rule

```js
const $ = this;
$.RULE("appStatement", () => {
  $.SUBRULE($.appClause);
  // ...
});
```

The parser could look something like this...

### AppMl Parser

`parser-util.ts`

```js
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
```

`AppMlParser.ts`

```ts
import { createClause, createDefClauses, oneOrMore } from "./parser-util";

class AppMlParser extends Parser {
  constructor() {
    super(allTokens);

    const $: any = this;
    const {
      tagId,
      createScope,
      oneOrMore,
      eitherOf,
      createClauses
    } = createUtil($);

    $.RULE("appStatement", () => {
      $.CONSUME(Application);
      tagId();
      // optional
      $.OPTION(() => {
        $.SUBRULE($.appScope);
      });
    });

    createScope("appScope", $.appDefinitions);
    eitherOf("appDef", $.extendsClause, $.fieldsClause, $.domainsClause);
    oneOrMore("appDefitions", $.appDef);
    createClauses("extends", "fields", "domains");

    this.performSelfAnalysis();
  }
}
```

### Usage

```js
import { AppMlLexer as Lexer } from "./lexer";
import { AppMlParser as Parser } from "./parser";

export { Lexer, Parser };

// ONLY ONCE
const parser: any = new Parser([]);

export const parse = (text: string) => {
  const lexingResult = Lexer.tokenize(text);
  // "input" is a setter which will reset the parser's state.
  parser.input = lexingResult.tokens;

  if (parser.errors.length > 0) {
    throw new Error("sad sad panda, Parsing errors detected");
  }

  return parser.appStatement();
};
```

## CST

The parser will also have to output some result/data structure/value.

This can be accomplished using a CST (Concrete Syntax Tree) Visitor defined outside our grammar:

See in depth documentation of Chevrotain's [CST capabilities](https://sap.github.io/chevrotain/docs/guide/concrete_syntax_tree.html)

### Enabling CST

```js
function parseInput(text) {
  const lexingResult = AppMlLexer.tokenize(text);
  const parser = new AppMlParser(lexingResult.tokens);

  // CST automatically created.
  const cstOutput = parser.appStatement();
}
```

### Sample CST

```js
$.RULE("variableStatement", () => {
  $.CONSUME(Var);
  $.CONSUME(Identifier);
  $.OPTION(() => {
    $.CONSUME(Equals);
    $.CONSUME(Integer);
  });
});
```

Example CST output

```js
input1 = "var x";

output1 = {
  name: "variableStatement",
  children: {
    Var: ["var"],
    Identifier: ["x"]
    // no "Equals" or "Integer" keys
  }
};
```

```js
input2 = "var x = 5";

output2 = {
  name: "variableStatement",
  children: {
    Var: ["var"],
    Identifier: ["x"],
    Equals: ["="],
    Integer: ["5"]
  }
};
```

## Traversing CST

[See CST traversing](https://sap.github.io/chevrotain/docs/guide/concrete_syntax_tree.html#traversing)

```js
// Tree Walker
export function toAst(cst) {
  const children = cst.children;
  switch (cst.name) {
    case "appStatement": {
      // ...
    }
    case "appClause": {
      // ... more cases
    }
    default: {
      throw new Error(
        `CST case handler not implemented for CST node <${cst.name}>`
      );
    }
  }
}
```

### CST Visitor

```js
// The base Visitor Class can be accessed via a Parser **instance**.
const BaseCstVisitor = myParserInstance.getBaseCstVisitorConstructor();

class AppMlToAstVisitor extends BaseCstVisitor {
  constructor() {
    super();
    // This helper will detect any missing or redundant methods on this visitor
    this.validateVisitor();
  }

  appStatement(ctx) {
    // ...

    return {
      type: "AppStatementAst",
      extends: appExtendsAst,
      fields: fieldsClauseAst,
      domains: domainsClauseAst
    };
  }

  // ... more methods
}
```
