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
  return this.selectCommentsByArticleId(article_id).then((response) => {
    const commentsById = response;
    return db
      .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
      .then((response) => {
        if (response.rows.length === 0) {
          return Promise.reject({
            status: 404,
            error: "ID number not found",
          });
        }
        const articleById = response.rows[0];
        articleById.comment_count = commentsById.length;

        return articleById;
      });
  });
};

exports.selectArticles = (sort_by, order, topic) => {
  const greenList = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
    "ASC",
    "DESC",
  ];
  const filterGreenList = ["mitch", "cats", "paper"];
  let queryArgs = [];
  let sqlQueryString = `SELECT 
    articles.article_id,
    articles.title,
    articles.topic,
    articles.author,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.comment_id)::INTEGER AS comment_count`;
  if (topic) {
    if (filterGreenList.includes(topic)) {
      sqlQueryString += ` FROM 
    articles
    LEFT JOIN 
    comments
    ON 
    articles.article_id = comments.article_id
    WHERE articles.topic= '${topic}'
    GROUP BY 
    articles.article_id`;
    } else if (!filterGreenList.includes(topic)) {
      return Promise.reject({ status: 404, error: "Query not found" });
    }
  }
  if (!topic || !filterGreenList.includes(topic)) {
    sqlQueryString += ` FROM 
    articles
    LEFT JOIN 
    comments
    ON 
    articles.article_id = comments.article_id
    GROUP BY 
    articles.article_id`;
  }

  if (sort_by) {
    if (greenList.includes(sort_by)) {
      sqlQueryString += ` ORDER BY articles.${sort_by}`;
      queryArgs.push(sort_by);
    } else if (!greenList.includes(sort_by)) {
      return Promise.reject({ status: 404, error: "Query not found" });
    }
  }
  if (order) {
    if (greenList.includes(order)) {
      sqlQueryString += ` ${order}`;
      queryArgs.push(order);
    } else if (!greenList.includes(order)) {
      return Promise.reject({ status: 404, error: "Query not found" });
    }
  }
  if (!sort_by) {
    sqlQueryString += ` ORDER BY articles.created_at`;
  }
  if (!order) {
    sqlQueryString += ` DESC;`;
  }
  return db.query(sqlQueryString).then(({ rows }) => {
    return rows;
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
  if (!body || typeof body !== "string" || body.length === 0 || !username) {
    return Promise.reject({ status: 400, error: "Incomplete post body" });
  }
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
    if (!inc_votes || typeof inc_votes !== "number") {
      return Promise.reject({ status: 400, error: "Incomplete patch body" });
    }
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

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then((response) => {
    return response.rows;
  });
};
