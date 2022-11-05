-- Connect to DB and create schema
CREATE DATABASE IF NOT EXISTS qa;
\c qa;

CREATE TABLE IF NOT EXISTS questions(
  id SERIAL PRIMARY KEY,
  product_id INT,
  question_body TEXT NOT NULL,
  question_date BIGINT NOT NULL,
  asker_name VARCHAR(100) NOT NULL,
  asker_email VARCHAR(320) NOT NULL,
  reported BOOLEAN DEFAULT false,
  question_helpfulness INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS answers(
  id SERIAL PRIMARY KEY,
  question_id INT REFERENCES questions (id),
  answer_body TEXT NOT NULL,
  answer_date BIGINT NOT NULL,
  answerer_name VARCHAR(100) NOT NULL,
  answerer_email VARCHAR(320) NOT NULL,
  reported BOOLEAN DEFAULT false,
  helpful INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS answers_photos(
  id SERIAL PRIMARY KEY,
  answer_id INT REFERENCES answers (id),
  url VARCHAR(2048) NOT NULL
);

-- ETL
COPY questions(id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness)
  FROM '/Users/joshgarza/HackReactor/QA_API/server/data/cleanQuestions.csv'
  DELIMITER ',' NULL AS 'null' CSV HEADER;

COPY answers(id, question_id, answer_body, answer_date, answerer_name, answerer_email, reported, helpful)
  FROM '/Users/joshgarza/HackReactor/QA_API/server/data/cleanAnswers.csv'
  DELIMITER ',' NULL AS 'null' CSV HEADER;

COPY answers_photos(id, answer_id, url)
  FROM '/Users/joshgarza/HackReactor/QA_API/server/data/cleanAnswersPhotos.csv'
  DELIMITER ',' NULL AS 'null' CSV HEADER;