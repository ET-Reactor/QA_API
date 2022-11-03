require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost/${process.env.PGDATABASE}`);

const photosSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  url: String
});
const answersSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  answer_body: String,
  answer_date: Date,
  answerer_name: String,
  answerer_email: String,
  helpful: Number,
  reported: Boolean,
  photos: [photosSchema]
});
const questionsSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  question_body: String,
  question_date: Date,
  asker_name: String,
  asker_email: String,
  question_helpfulness: Number,
  reported: Boolean,
  answers: [answersSchema]
});

const Questions = mongoose.model('Questions', questionsSchema);

module.exports.Questions = Questions;