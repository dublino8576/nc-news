const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
/* Set up your test imports here */
const endpointsJson = require("../endpoints.json");
const index = require("../db/data/test-data/index");
const { getArticleById } = require("../controller/controller");
/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  index;
});
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

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects, each of which should have the slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
  test('404: Responds with an error message of "Endpoint not found" wrong URL being input', () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then((response) => {
        const body = response.body;
        expect(body.error).toBe("Endpoint not found");
      });
  });
});

describe.only("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object with the corresponding article id", () => {
    return request(app)
      .get("/api/articles/7")
      .expect(200)
      .then((response) => {
        const article = response.body;
        console.log(article);
        expect(article.title).toBe("Using React Native: One Year Later");
        expect(article.topic).toBe("coding");
        expect(article.author).toBe("tickle122");
        expect(article.body).toBe(
          "When I interviewed for the iOS developer opening at Discord last spring, the tech lead Stanislav told me: React Native is the future. We will use it to build our iOS app from scratch as soon as it becomes public. As a native iOS developer, I strongly doubted using web technologies to build mobile apps because of my previous experiences with tools like PhoneGap. But after learning and using React Native for a while, I am glad we made that decision."
        );
        expect(article.created_at).toBe("2020-10-18T00:26:00.000Z");
        expect(article.votes).toBe(0);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/6424586/pexels-photo-6424586.jpeg?w=700&h=700"
        );
        expect(article).toEqual(article);
      });
  });
});
