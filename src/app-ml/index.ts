import { AppMlLexer as Lexer } from "./lexer";
import {
  AppMlParser as Parser,
  createAppMlParser as createParser
} from "./parser";

import * as cst from "./cst";
export { Lexer, Parser, cst };

export const parser: any = createParser();

export const BaseVisitor = parser.getBaseCstVisitorConstructor();

// This BaseVisitor include default visit methods that simply traverse the CST.
export const BaseVisitorWithDefaults = parser.getBaseCstVisitorConstructorWithDefaults();

export const parse = (text: string) => {
  const lexingResult = Lexer.tokenize(text);
  // "input" is a setter which will reset the parser's state.
  parser.input = lexingResult.tokens;

  if (parser.errors.length > 0) {
    throw new Error("sad sad panda, Parsing errors detected");
  }

  return parser.appStatement();
};
