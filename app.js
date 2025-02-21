const express = require("express");
const app = express();
const cors = require("cors");
const {
  getAllTopics,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postComment,
  updateArticle,
  deleteCommentById,
  getUsers,
} = require("./controller/controller");
const endpointsJson = require("./endpoints.json");

app.use(cors());

app.use(express.json());

// >>>> existing endpoints
app.get("/api", (request, response, next) => {
  response.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", updateArticle);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

// >>>> non existent endpoints & middleware error handling section

app.all("*", (request, response) => {
  response.status(404).send({ error: "Endpoint not found" });
});
app.use((error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ error: "Wrong data type in the URL" });
  } else if (error.status === 400 && error.error === "Incomplete post body") {
    response.status(400).send({ error: "Incomplete post body" });
  } else if (error.status === 400 && error.error === "Incomplete patch body") {
    response.status(400).send({ error: "Incomplete patch body" });
  } else {
    next(error);
  }
});

app.use((error, request, response, next) => {
  if (error.status === 404 && error.error === "ID number not found") {
    response.status(404).send({ error: "ID number not found" });
  } else if (error.status === 404 && error.error === "User not found") {
    response.status(404).send({ error: "User not found" });
  } else if (error.status === 404 && error.error === "Query not found") {
    response.status(404).send({ error: "Query not found" });
  } else {
    next(error);
  }
});
app.use((error, request, response, next) => {
  console.log(error, "end of middleware");
  response.status(500).send({ msg: "Internal Server error" });
});

module.exports = app;
