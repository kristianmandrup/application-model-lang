import { AppMlLexer as Lexer } from "./lexer";
import { AppMlParser as Parser } from "./parser";

export { Lexer, Parser };

const parser: any = new Parser();

export const parse = (text: string) => {
  const lexingResult = Lexer.tokenize(text);
  // "input" is a setter which will reset the parser's state.
  parser.input = lexingResult.tokens;

  if (parser.errors.length > 0) {
    throw new Error("sad sad panda, Parsing errors detected");
  }

  return parser.appStatement();
};
