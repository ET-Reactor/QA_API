const { pool } = require('../db/db.js');

module.exports = {
  getQuestions: async (productId, callback) => {
    try {
      const res = await pool.query(`SELECT * FROM questions WHERE product_id=${productId} LIMIT 5`);
      callback(null, res.rows);
    } catch (error) {
      console.log('Error fetching questions', error);
      callback(error, null);
    }
  },

  getProduct: () => {

  },
  getProducts: () => {

  },
  getStyles: () => {

  }
};
// getRelated: async (productID, callback) => {
//   try {
//     const res = await pool.query("SELECT * FROM related WHERE current_product_id=?", [productID]);
//     console.log(res.rows);
//   } catch (error) {
//     console.log('getRelated error', error);
//   }
// },