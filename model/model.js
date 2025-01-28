const db = require("../db/connection");
const { convertTimestampToDate } = require("../db/seeds/utils");

exports.selectAllTopics = (request, response, next) => {
  return db.query(`SELECT * FROM topics;`).then((topics) => {
    return topics.rows;
  });
};

exports.selectArticleById = (article_id) => {
  console.log(article_id);
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((response) => {
      return response.rows[0];
    });
};
