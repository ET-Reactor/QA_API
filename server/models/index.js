const { pool } = require('../db/db.js');

module.exports = {
  getQuestions: async (queries, callback) => {
    let productId = queries.id;
    let { page, count } = queries;

    try {
      let completedQueries = false;

      const questions = await pool.query(`
        SELECT * FROM questions
        WHERE product_id=${productId}
        AND reported=false
        ORDER BY product_id
        LIMIT ${count}
        OFFSET((${page} - 1) * ${count})`
      );

      if (questions.rows.length === 0) {
        callback(null, {})
      } else {
        questions.rows.forEach((question, i) => {
          delete question.product_id
          delete question.asker_email
          pool.query(`SELECT * FROM answers WHERE question_id=${question.id} AND reported=false`)
            .then(answers => {
              let answersResponse = {};

              if (answers.rows.length === 0 && i === questions.rows.length - 1 && completedQueries === false) {
                completedQueries = true;
                let response = {};
                response.product_id = productId;
                response.results = questions.rows;
                callback(null, response)
              } else {
                answers.rows.forEach((answer, j) => {
                  answersResponse[`${answer.id}`] = answer;
                  pool.query(`SELECT * FROM answers_photos WHERE answer_id=${answer.id}`)
                    .then(photoInfo => {
                      answer.photos = photoInfo.rows
                      question.answers = answersResponse
                      delete answer.question_id
                      delete answer.answerer_email
                      photoInfo.rows.forEach(photo => delete photo.answer_id)

                      // Checking that we're at the last item to be queried
                      if (i === questions.rows.length - 1 && j === answers.rows.length - 1 && completedQueries === false) {
                        completedQueries = true;
                        let response = {};
                        response.product_id = productId;
                        response.results = questions.rows;
                        callback(null, response)
                      }
                    })
                })
              }
            })
        })
      }
    } catch (error) {
      console.log('Error fetching questions', error);
      callback(error, null);
    }
  },
  getAnswers: async (queries, callback) => {
    console.log(queries);
    let questionId = queries.id;
    let { page, count } = queries;

    try {
      let completedQueries = false;
      const answers = await pool.query(
        `SELECT * FROM answers
        WHERE question_id=${questionId}
        AND reported=false
        ORDER by question_id
        LIMIT ${count}
        OFFSET((${page} - 1) * ${count})`
      )

      let answersResponse = []

      if (answers.rows.length === 0) {
        callback(null, answersResponse)
      } else {
        answers.rows.forEach((answer, i) => {
          answersResponse.push(answer);

          pool.query(`SELECT * FROM answers_photos WHERE answer_id=${answer.id}`)
            .then(photoInfo => {
              answer.photos = photoInfo.rows
              delete answer.question_id
              delete answer.answerer_email
              photoInfo.rows.forEach(photo => delete photo.answer_id)

              if (i >= answers.rows.length - 1 && completedQueries === false) {
                completedQueries = true;
                let response = {};
                response.question = questionId;
                response.results = answersResponse;

                callback(null, response)
              }
            })
        })
      }
    } catch (error) {
      console.log('Error fetching answers', error);
      callback(error, null);
    }
  },

  postQuestion: async (req, callback) => {
    const { product_id, body, name, email } = req;
    try {
      const currDate = Date.now();
      pool.query(
        `INSERT INTO questions(
          product_id,
          question_body,
          question_date,
          asker_name,
          asker_email
          )
          VALUES(
            ${product_id},
            '${body}',
            ${currDate},
            '${name}',
            '${email}'
          )`
      )
        .then(result => {
          callback(null, req)
        })
    } catch (error) {
      console.log('Error posting question', error)
      callback(error, null)
    }
  },

  postAnswer: async (reqBody, questionId, callback) => {
    const { body, name, email, photos } = reqBody;
    try {
      const currDate = Date.now();
      pool.query(
        `INSERT INTO answers(
          question_id,
          answer_body,
          answer_date,
          answerer_name,
          answerer_email
          )
          VALUES(
            ${questionId},
            '${body}',
            ${currDate},
            '${name}',
            '${email}'
          )`
      )
        .then(result => {
          pool.query(
            `SELECT id FROM answers
            ORDER BY id DESC
            LIMIT 1`
          )
            .then(result => {
              const answerId = result.rows[0].id;
              photos.forEach((photo, i) => {
                pool.query(
                  `INSERT INTO answers_photos(
                    answer_id,
                    url
                  )
                  VALUES(
                    ${answerId},
                    '${photo}'
                  )`
                )
                  .then(result => {
                    if (i === photos.length - 1) {
                      callback(null, reqBody)
                    }
                  })
              })
            })
        })
    } catch (error) {
      console.log('Error posting question', error)
      callback(error, null)
    }
  },
  putHelpfulQuestion: (questionId, callback) => {
    pool.query(
      `UPDATE questions
      SET question_helpfulness=question_helpfulness + 1
      WHERE id=${questionId}`
    )
      .then(result => callback(null, result))
      .catch(err => callback(err, null))
  },
  putReportQuestion: (questionId, callback) => {
    pool.query(
      `UPDATE questions
      SET reported=true
      WHERE id=${questionId}`
    )
      .then(result => callback(null, result))
      .catch(err => callback(err, null))
  },
  putHelpfulAnswer: (answerId, callback) => {
    pool.query(
      `UPDATE answers
      SET helpful=helpful + 1
      WHERE id=${answerId}`
    )
      .then(result => callback(null, result))
      .catch(err => callback(err, null))
  },
  putReportAnswer: (answerId, callback) => {
    pool.query(
      `UPDATE answers
      SET reported=true
      WHERE id=${answerId}`
    )
      .then(result => callback(null, result))
      .catch(err => callback(err, null))
  }
};