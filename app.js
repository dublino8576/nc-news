const express = require("express");
const app = express();
const { getAllTopics, getArticleById } = require("./controller/controller");
const endpointsJson = require("./endpoints.json");

app.use(express.json());

app.get("/api", (request, response, next) => {
  response.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.all("*", (request, response) => {
  response.status(404).send({ error: "Endpoint not found" });
});
app.use((error, response, request, next) => {
  console.log(error);
  response.status(500).send({ msg: "Internal Server error" });
});

module.exports = app;
