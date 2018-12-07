# Higher Reason

A set of high level language that declares the outline of an application.
This definition can be used across languages, frameworks etc.

- designed to be highly pluggable.
- will include editor IDE support, initially for VS Code.

## Application model

```
application WebShop {
    infra: Infra,
    fields: Fields,
    domains: Domains,
    components: Components
}
```

- [Domain models](./docs/DomainModel.md)
- [Fields](./docs/Fields.md)
- [Infrastructure](./docs/Infrastructure.md)
- [Components](./docs/components/Component.md)
- [GraphQL](./docs/graphql/GraphQL.md)

## Environments

The model should make it easy to create multiple application definitions, such as for:

- dev
- test
- staging
- production
- feature spike
- experimental
- variants
- ...

By combining and compose he variants of each to form new models.

### Example using extensions

```
application WebShop#test {
    extends: Webshop,
    // overrides
    fields: Fields#test,
    domains: Domains#test,
}
```

## Pluggable AST outputter

We would like to be able to generate the final output to support a range of languages, frameworks etc. For this to work, we need a plugin system.

The target environment can then select a number of plugins via installation of npm modules.
A plugin is a service.

Each service module must have a main file, which when executed starts listening to a given port (default `6226`) for specific AST messages.

The project needs to have a config file which lists the services to be used and executed:

`aml-services.json`

```json
{
  "services": {
    "@aml/reason-typeorm-service": {
      "template": "default"
    },
    "@aml/reason-react-service": {
      "template": "default"
    },
    "@aml/reason-graphql-service": {
      "template": "./templates/reason-graphql-service"
    }
  },
  "port:: 6226
}
```

When a plugin (service) receives an AST of interest, it can process and output one or more files to reflect it. Multiple services can even collaborate by passing messages if needed!

Multiple services can subscribe to the same type of AST node to output multiple files!

We will use [SenecaJS](http://senecajs.org/getting-started/) to have a message based publish/subscribe micro services, where an AST visitor (langaueg server) can broadcast the AST to subscribing services.

The client services can use whatever language or library to listen for AST messages and respond.

### AST client service

```js
const path = require("path");
const seneca = require("seneca")();

const service = {
  name: "reason-typeorm"
};

seneca.add({ role: "aml", cmd: "domain" }, ({ data }, reply) => {
  // output domain file
  const filePath = path.join(projRoot, "models", modelName(data.name));
  // ...

  // reply domain file was outputted
  reply(null, { domain: data.name, service });
});
```

### AST Server

```js
const seneca = require("seneca")();

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
  seneca.act({ role: "aml", cmd: "domain", data }, (err, result) => {
    if (err) handleError(err);
    handleResult(result);
  });
};
```

## Parser Generator

[chevrotain](https://github.com/SAP/chevrotain) by [SAP](https://github.com/SAP)

```
yarn add chevrotain
```

### Lexer

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
const Anchor = createToken({ name: "Anchor", pattern: /#/ });

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
let allTokens = [
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
  Anchor,
  // The Identifier must appear after the keywords because all keywords are valid identifiers.
  Identifier,
  Integer
];
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

### Parser

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

```js
class AppMlParser extends Parser {
  constructor() {
    super(allTokens);

    const $ = this;

    $.RULE("appStatement", () => {
      $.CONSUME(Application);
      // debug
      debugger;
      $.AT_LEAST_ONE_SEP({
        SEP: WhiteSpace,
        DEF: () => {
          $.CONSUME(Identifier);
        }
      });

      // optional
      $.OPTION(() => {
        $.SUBRULE($.appClause);
      });
    });

    $.RULE("appClause", () => {
      $.CONSUME(LBrace);
      // optional
      $.OPTION(() => {
        $.SUBRULE($.appDefitions);
      });
      $.CONSUME(RBrace);
    });

    $.RULE("appDefitions", () => {
      $.AT_LEAST_ONE_SEP({
        SEP: Comma,
        DEF: () => {
          $.CONSUME($.appDef);
        }
      });
    });

    $.RULE("appDef", () => {
      $.OR([
        { ALT: () => $.CONSUME($.extendsClause) },
        { ALT: () => $.CONSUME($.fieldsClause) },
        { ALT: () => $.CONSUME($.domainsClause) }
      ]);
    });

    $.RULE("extendsClause", () => {
      $.CONSUME(Extends);
      $.CONSUME(WhiteSpace);
      $.CONSUME(Identifier);
      // todo: optional Anchor
      $.OPTION(() => {
        $.CONSUME(Anchor);
        $.CONSUME(Identifier);
      });
    });

    $.RULE("fieldsClause", () => {
      $.CONSUME(Fields);
      $.CONSUME(WhiteSpace);
      $.CONSUME(Identifier);
      // todo: optional Anchor
      $.OPTION(() => {
        $.CONSUME(Anchor);
        $.CONSUME(Identifier);
      });
    });

    $.RULE("domainsClause", () => {
      $.CONSUME(Domains);
      $.CONSUME(WhiteSpace);
      $.CONSUME(Identifier);
      // todo: optional Anchor
      $.OPTION(() => {
        $.CONSUME(Anchor);
        $.CONSUME(Identifier);
      });
    });

    this.performSelfAnalysis();
  }
}
```

### Usage

```js
// ONLY ONCE
const parser = new AppMlParser([]);

function parseInput(text) {
  const lexingResult = AppMlLexer.tokenize(text);
  // "input" is a setter which will reset the parser's state.
  parser.input = lexingResult.tokens;
  parser.appStatement();

  if (parser.errors.length > 0) {
    throw new Error("sad sad panda, Parsing errors detected");
  }
}

const inputText = "application Webshop:test {}";
parseInput(inputText);
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

### Traversing CST

[See CST traversing](https://sap.github.io/chevrotain/docs/guide/concrete_syntax_tree.html#traversing)

```js
// Tree Walker
export function toAst(cst) {
  const children = cst.children
  switch (cst.name) {
    case "appStatement": {
      // ...
    }
    case "appClause": {
    // ... more cases

    default: {
      throw new Error(
        `CST case handler not implemented for CST node <${cst.name}>`
      )
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

###
