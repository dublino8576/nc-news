const {
  selectAllTopics,
  selectArticleById,
  selectArticles,
} = require("../model/model");

exports.getAllTopics = (request, response, next) => {
  return selectAllTopics(request, response, next)
    .then((topics) => {
      response.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  return selectArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (request, response, next) => {
  return selectArticles()
    .then((articles) => {
      response.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
    });
};
