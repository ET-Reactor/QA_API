const { pool } = require('../db/db.js');
const db = require('../db/mongodb.js');

module.exports = {
  getQuestions: async () => {
    try {
      // promise - checkout a client
      // pool.query('SELECT * from test', (err, res) => {
      //   console.log(err, res.rows)
      //   pool.end()
      // })
      db.Questions.query(db.find())
    } catch (error) {
      console.log(error);
    }
  },
  getProduct: () => {

  },
  getProducts: () => {

  },
  getStyles: () => {

  }
};