const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
/* Set up your test imports here */
const endpointsJson = require("../endpoints.json");
/* Set up your beforeEach & afterAll functions here */

afterAll(() => db.end());
describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
  test('404: Responds with a message of "Endpoint not found"', () => {
    return request(app)
      .get("/api/minimum")
      .expect(404)
      .then((response) => {
        const body = response.body;
        expect(body.error).toBe("Endpoint not found");
      });
  });
});
