const request = require("supertest");
const { app, server } = require("../../index"); // Import both app & server

describe("GET /users", () => {
  beforeAll(() => {
    if (!server) {
      throw new Error("Server did not start properly.");
    }
  });

  afterAll((done) => {
    if (server) {
      server.close(done); // Ensure server closes properly
    } else {
      done();
    }
  });

  it("should return an array of users", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});