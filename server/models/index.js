const { pool } = require('../db/db.js');

module.exports = {
  getQuestions: async () => {
    try {
      // promise - checkout a client
      pool.query('SELECT * from test', (err, res) => {
        console.log(err, res.rows)
        pool.end()
      })
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

// const { Pool } = require('pg')
// const pool = new Pool()
// pool.query('SELECT * FROM users WHERE id = $1', [1], (err, res) => {
//   if (err) {
//     throw err
//   }
//   console.log('user:', res.rows[0])
// })

// pool.connect((err, client, done) => {
//   if (err) throw err
//   client.query('SELECT * FROM users WHERE id = $1', [1], (err, res) => {
//     done()
//     if (err) {
//       console.log(err.stack)
//     } else {
//       console.log(res.rows[0])
//     }
//   })
// })