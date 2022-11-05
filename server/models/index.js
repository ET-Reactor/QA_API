const { pool } = require('../db/db.js');

module.exports = {
  getQuestions: async (productId, callback) => {
    try {
      let completedQueries = false;

      const questions = await pool.query(`SELECT * FROM questions WHERE product_id=${productId} LIMIT 5`);

      questions.rows.forEach((question, i) => {
        delete question.product_id
        delete question.asker_email
        pool.query(`SELECT * FROM answers WHERE question_id=${question.id}`)
          .then(answers => {
            let answersResponse = {}
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
          })
      })
    } catch (error) {
      console.log('Error fetching questions', error);
      callback(error, null);
    }
  },
  getAnswers: async (questionId, callback) => {
    try {
      let completedQueries = false;
      pool.query(`SELECT * FROM answers WHERE question_id=${questionId}`)
        .then(answers => {
          let answersResponse = []
          answers.rows.forEach((answer, i) => {
            answersResponse.push(answer);

            pool.query(`SELECT * FROM answers_photos WHERE answer_id=${answer.id}`)
              .then(photoInfo => {
                answer.photos = photoInfo.rows
                delete answer.question_id
                delete answer.answerer_email
                photoInfo.rows.forEach(photo => delete photo.answer_id)

                if (i === answers.rows.length - 1 && completedQueries === false) {
                  completedQueries = true;
                  let response = {};
                  response.question = questionId;
                  response.results = answersResponse;

                  callback(null, response)
                  }
                })
              })
        })
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

  // Parameter	Type	Description
  // body	text	Text of question being asked
  // name	text	Username for question asker
  // email	text	Email address for question asker
  // photos	[text]	An array of urls corresponding to images to display
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
          // console.log(result)
          pool.query(
            `SELECT id FROM answers
            ORDER BY id DESC
            LIMIT 1`
          )
            .then(result => {
              const answerId = result.rows[0].id;
              photos.forEach((photo, i) => {
                console.log(photo)
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
  putHelpfulQuestion: () => {

  },
  putReportQuestion: () => {

  },
  putHelpfulAnswer: () => {

  },
  putReportAnswer: () => {

  }
};