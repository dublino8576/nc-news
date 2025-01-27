const { selectAllTopics, selectArticleById } = require("../model/model");

exports.getAllTopics = (request, response, next) => {
  return selectAllTopics(request, response, next)
    .then((topics) => {
      console.log(topics);
      response.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  return selectArticleById(article_id).then((article) => {
    response.status(200).send({ article: article });
  });
};
