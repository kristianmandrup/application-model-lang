import { createServer } from "./server";

describe("server", () => {
  const server = createServer();

  test("onNode", async () => {
    const node = {
      type: "domain",
      name: "User"
    };
    const result = await server.onNode(node);
    expect(result).toBeDefined();
  });
});
