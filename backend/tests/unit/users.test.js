const request = require("supertest");
const app = require("../../index"); // Import the app without starting the server
let server; // Store the running server instance

describe("GET /users", () => {
  // Start the server before running tests
  beforeAll(() => {
    server = app.listen(5000);
  });

  // Stop the server after tests are done
  afterAll((done) => {
    server.close(done);
  });

  it("should return an array of users", async () => {
    const res = await request(server).get("/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});