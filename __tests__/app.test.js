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
  return seed(index);
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
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object with the corresponding article id", () => {
    return request(app)
      .get("/api/articles/7")
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article.title).toBe("Z");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("icellusedkars");
        expect(article.body).toBe("I was hungry.");
        expect(typeof article.created_at).toBe("string");
        expect(article.votes).toBe(0);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("200: Responds with an article object that also has the total comment count property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("butter_bridge");
        expect(article.body).toBe("I find this existence challenging");
        expect(typeof article.created_at).toBe("string");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(article.comment_count).toBe(11);
      });
  });
  test('400: Responds with error message of "Bad request"', () => {
    return request(app)
      .get("/api/articles/notThis")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error).toBe("Wrong data type in the URL");
      });
  });
  test("404: Responds with an error message of ID not found", () => {
    return request(app)
      .get("/api/articles/400")
      .expect(404)
      .then((response) => {
        const error = response.body;
        expect(error).toEqual({ error: "ID number not found" });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an articles array of article objects, each of which should have author, title, article_id, topic, created_at, votes, article_img_url, comment_count. it should not have a property of body and it should be ordered in DESC order by date of article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(article).toEqual(
            expect.not.objectContaining({
              body: expect.any(String),
            })
          );
        });
        expect(articles).toBeSorted({ key: "created_at", descending: true });
      });
  });
  test("200: Responds with an array of article objects which are sorted by any given property", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        expect(articles).toBeSorted({ key: "title", descending: true });
      });
  });
  test("200: Responds with an array of article objects which are sorted by any given property by optional ascendent order", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=ASC")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        expect(articles).toBeSorted({ key: "author" });
      });
  });
  test.skip("200: Responds with an array of article objects which are filtered by their topic of interest", () => {
    return request(app)
      .get("/api/articles?topic=cooking")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("404: Responds with an error message of 'Endpoint not found'", () => {
    return request(app)
      .get("/api/article")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("Endpoint not found");
      });
  });
  test("404:Responds with an error of message 'Query not found' when order has incorrect value", () => {
    return request(app)
      .get("/api/article?order=notThis")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("Endpoint not found");
      });
  });
  test('404: Responds with an error of message "Query not found" when topic has incorrect value', () => {
    return request(app)
      .get("/api/articles?topic=notThis")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("Query not found");
      });
  });
  test('404: Responds with an error of message "Query not found" when sort_by has incorrect value', () => {
    return request(app)
      .get("/api/articles?sort_by=mammino&order=notThis")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("Query not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article_id ordered by newer comments first. Each comment to have properties of body, article_id, author, comment_id, created_at and votes", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            article_id: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
        expect(comments).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
  test("200: Responds with an empty array of comments when article doesn't have any comments on it'", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(0);
      });
  });
  test("400: Responds with a message of 'Bad request'", () => {
    return request(app)
      .get("/api/articles/notanumber/comments")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error).toBe("Wrong data type in the URL");
      });
  });
  test("404: Responds with a message of 'ID number not found'", () => {
    return request(app)
      .get("/api/articles/265/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("ID number not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comments that has been added to the article", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        body: "I have to say I find this info interesting!!!",
        username: "icellusedkars",
      })
      .expect(201)
      .then(({ body: { newComment } }) => {
        //controller returns a response body of newComment object and we destructure it to make the response body be called newComment. The names of newComment have to match to work
        expect(newComment.comment_id).toBe(19);
        expect(newComment.author).toBe("icellusedkars");
        expect(newComment.body).toBe(
          "I have to say I find this info interesting!!!"
        );
        expect(newComment.article_id).toBe(1);
        expect(typeof newComment.created_at).toBe("string");
        expect(newComment.votes).toBe(0);
      });
  });
  test('400: Responds with an error message of "Incomplete post body"', () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        body: "",
        username: "",
      })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error).toBe("Incomplete post body");
      });
  });
  test("400: Responds with a message of 'Wrong data type in the URL'", () => {
    return request(app)
      .post("/api/articles/notThis/comments")
      .send({
        body: "I have to say I find this info interesting!!!",
        username: "icellusedkars",
      })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error).toBe("Wrong data type in the URL");
      });
  });
  test("404: Responds with a message of 'ID number not found'", () => {
    return request(app)
      .post("/api/articles/265/comments")
      .send({
        body: "I have to say I find this info interesting!!!",
        username: "icellusedkars",
      })
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("ID number not found");
      });
  });
  test('404: Responds with a message of "User not found"', () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        body: "I have to say I find this info interesting!!!",
        username: "bambolino65",
      })
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("User not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the updated article ", () => {
    return request(app)
      .patch("/api/articles/7")
      .send({ inc_votes: -50 })
      .expect(200)
      .then(({ body: { updatedArticle } }) => {
        expect(updatedArticle.article_id).toBe(7);
        expect(updatedArticle.title).toBe("Z");
        expect(updatedArticle.topic).toBe("mitch");
        expect(updatedArticle.author).toBe("icellusedkars");
        expect(updatedArticle.body).toBe("I was hungry.");
        expect(typeof updatedArticle.created_at).toBe("string");
        expect(updatedArticle.votes).toBe(-50);
        expect(updatedArticle.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("400: Responds with a message of 'Incomplete patch body'", () => {
    return request(app)
      .patch("/api/articles/7")
      .expect(400)
      .send({ hello: 33 })
      .then(({ body: { error } }) => {
        expect(error).toBe("Incomplete patch body");
      });
  });

  test("400: Responds with a message of Wrong data type in the URL", () => {
    return request(app)
      .patch("/api/articles/notThis")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error).toBe("Wrong data type in the URL");
      });
  });
  test("404: Responds with a message of Wrong data type in the URL", () => {
    return request(app)
      .patch("/api/articles/86")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("ID number not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with the code number 204 and no content", () => {
    return request(app).delete("/api/comments/5").expect(204);
  });
  test("400: Responds with error of 'Wrong data type in the URL'", () => {
    return request(app)
      .delete("/api/comments/notThis")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error).toBe("Wrong data type in the URL");
      });
  });
  test("404: Responds with error of 'ID number not found'", () => {
    return request(app)
      .delete("/api/comments/99")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("ID number not found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of user objects with username, name and avatar_url properties ", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("404: Responds with an error of 'Endpoint not found'", () => {
    return request(app)
      .get("/api/user")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toBe("Endpoint not found");
      });
  });
});
