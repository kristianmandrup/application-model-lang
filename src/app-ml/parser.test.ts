import { parse } from "./";

describe("Parse", () => {
  describe("appplication", () => {
    describe("Webshop", () => {
      const inputText = "application Webshop {}";
      const cst = parse(inputText);
      console.log({ cst });

      test("cst", () => {
        expect(typeof cst).toEqual("object");
      });
    });

    describe("#test", () => {
      const inputText = "application Webshop#test {}";
      const cstTest = parse(inputText);
      console.log({ cstTest });

      test("cst", () => {
        expect(typeof cst).toEqual("object");
      });
    });
  });
});
