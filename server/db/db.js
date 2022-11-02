require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: 5432,
  host: process.env.PGHOST,
});


pool
  .query('CREATE TABLE IF NOT EXISTS questions (id SERIAL PRIMARY KEY, question_body TEXT NOT NULL, question_date DATE NOT NULL, asker_name VARCHAR(255) NOT NULL, asker_email VARCHAR(100) NOT NULL, question_helpfulness INT, reported BOOLEAN)')
  .then(res => console.log(res.rows))
  .catch(err => console.error('Error executing query', err.stack))

pool
  .query('CREATE TABLE IF NOT EXISTS answers (id SERIAL PRIMARY KEY, question_id INT REFERENCES questions (id), answer_body TEXT NOT NULL, answer_date DATE NOT NULL, answerer_name VARCHAR(100) NOT NULL, answerer_email VARCHAR(100) NOT NULL, reported BOOLEAN, helpful INT)')
  .then(res => console.log(res.rows))
  .catch(err => console.error('Error executing query', err.stack))

pool
  .query('CREATE TABLE IF NOT EXISTS answers_photos (id SERIAL PRIMARY KEY, answer_id INT REFERENCES answers (id), url TEXT NOT NULL)')
  .then(res => console.log(res.rows))
  .catch(err => console.error('Error executing query', err.stack))

module.exports = { pool };