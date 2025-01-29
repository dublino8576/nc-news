const {
  selectAllTopics,
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  insertComment,
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

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  return selectCommentsByArticleId(article_id)
    .then((comments) => {
      response.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (request, response, next) => {
  //look for the article and correct body and username to insert in the db.query
  const { article_id } = request.params;
  const { username } = request.body;
  const { body } = request.body;
  return insertComment(body, username, article_id)
    .then((insertedComment) => {
      response.status(201).send({ newComment: insertedComment });
    })
    .catch((err) => {
      next(err);
    });
};
