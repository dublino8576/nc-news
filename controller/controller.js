const {
  selectAllTopics,
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  insertComment,
  patchArticleVotes,
  removeCommentById,
  selectUsers,
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
  //make a variable for each query and then make a greenlist
  const { sort_by } = request.query;
  const { order } = request.query;
  const { topic } = request.query;
  return selectArticles(sort_by, order, topic)
    .then((articles) => {
      response.status(200).send({ articles });
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

exports.updateArticle = (request, response, next) => {
  const { inc_votes } = request.body;
  const { article_id } = request.params;
  return patchArticleVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      response.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  return removeCommentById(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (request, response, next) => {
  return selectUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
