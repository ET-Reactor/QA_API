require('dotenv').config();
const mongoose, { Schema } = require('mongoose');

mongoose.connect(`mongodb://localhost/${process.env.PGDATABASE}`);

const questionsSchema = new Schema({
  id: { type: Number, unique: true, required: true },
  question_body: String,
  question_date: Date,
  asker_name: String,
  asker_email: String,
  question_helpfulness: Number,
  reported: Boolean,
  answers: [answersSchema]
});
const answersSchema = new Schema({
  id: { type: Number, unique: true, required: true },
  answer_body: String,
  answer_date: Date,
  answerer_name: String,
  answerer_email: String,
  helpful: Number,
  reported: Boolean,
  photos: [photosSchema]
});
const photosSchema = new Schema({
  id: { type: Number, unique: true, required: true },
  url: String
});

const Questions = mongoose.model('Questions', questionsSchema);

module.exports.Product = Product;
module.exports.Style = Style;