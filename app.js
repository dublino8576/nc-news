const express = require("express");
const app = express();
const {
  getAllTopics,
  getArticleById,
  getArticles,
} = require("./controller/controller");
const endpointsJson = require("./endpoints.json");

app.use(express.json());

// >>>> existing endpoints
app.get("/api", (request, response, next) => {
  response.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

// >>>> non existent endpoints & middleware error handling section

app.all("*", (request, response) => {
  response.status(404).send({ error: "Endpoint not found" });
});
app.use((error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ error: "Bad request" });
  } else {
    next(error);
  }
});

app.use((error, request, response, next) => {
  if (error.status === 404 && error.error === "ID number not found") {
    response.status(404).send({ error: "ID number not found" });
  } else {
    next(error);
  }
});
app.use((error, request, response, next) => {
  console.log(error, "end of middleware");
  response.status(500).send({ msg: "Internal Server error" });
});

module.exports = app;
