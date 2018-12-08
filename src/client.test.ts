import { client } from ".";
const { createClient } = client;

describe("client", () => {
  const client = createClient();

  test("fileWriters", () => {
    expect(client.fileWriters).toBeDefined();
  });
});
