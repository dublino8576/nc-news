const db = require("../db/connection");
const { convertTimestampToDate } = require("../db/seeds/utils");

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
