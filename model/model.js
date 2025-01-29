const db = require("../db/connection");
const {
  convertTimestampToDate,
  checkArticleIdExists,
  checkUserExists,
} = require("../db/seeds/utils");

exports.selectAllTopics = (request, response, next) => {
  return db.query(`SELECT * FROM topics;`).then((topics) => {
    return topics.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({ status: 404, error: "ID number not found" });
      }
      return response.rows[0];
    });
};

exports.selectArticles = () => {
  return db
    .query(
      `SELECT 
    articles.article_id,
    articles.title,
    articles.topic,
    articles.author,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.comment_id)::INTEGER AS comment_count
FROM 
    articles
LEFT JOIN 
    comments
ON 
    articles.article_id = comments.article_id
GROUP BY 
    articles.article_id
ORDER BY 
    articles.created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return checkArticleIdExists(article_id)
    .then(() => {
      return db.query(
        `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
        [article_id]
      );
    })
    .then((response) => {
      return response.rows;
    });
};

exports.insertComment = (body, username, article_id) => {
  return checkArticleIdExists(article_id).then(() => {
    return checkUserExists(username).then(() => {
      //default keys are automatically added with default keyword
      return db
        .query(
          `INSERT INTO comments (body, author, article_id, votes, created_at)
      VALUES 
      ($1, $2, $3, DEFAULT, DEFAULT)
      RETURNING *`,
          [body, username, article_id]
        )
        .then((response) => {
          return response.rows[0];
        });
    });
  });
};

exports.patchArticleVotes = (article_id, inc_votes) => {
  return this.selectArticleById(article_id).then((article) => {
    article.votes += inc_votes;
    return article;
  });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments
    WHERE comment_id = $1`,
      [comment_id]
    )
    .then((response) => {
      //if rowCount is 1 then comment is deleted
      const deletedComments = response.rowCount;
      if (deletedComments === 0) {
        return Promise.reject({ status: 404, error: "ID number not found" });
      }
    });
};
