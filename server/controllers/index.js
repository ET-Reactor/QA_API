const models = require('../models');
// router.get('/qa/questions', controllers.getAllQ);
const getAllQ = (req, res) => {
  models.getQuestions()
  res.status(200).send("get all questions")
}
const getAllA = (req, res) => {
  res.status(200).send('get all answers')
}
const postQues = (req, res) => {
  res.status(201).send('successful question post')
}
const postAnsw = (req, res) => {
  res.status(201).send('successful answer post')
}
const helpfulQues = (req, res) => {
  res.status(200).send('successful helpful ques put')
}
const reportQues = (req, res) => {
  res.status(200).send('successful report ques put')
}
const helpfulAnsw = (req, res) => {
  res.status(200).send('successful helpful answ put')
}
const reportAnsw = (req, res) => {
  res.status(200).send('successful helpful answ put')
}

module.exports.getAllQ = getAllQ;
module.exports.getAllA = getAllA;
module.exports.postQues = postQues;
module.exports.postAnsw = postAnsw;
module.exports.helpfulQues = helpfulQues;
module.exports.reportQues = reportQues;
module.exports.helpfulAnsw = helpfulAnsw;
module.exports.reportAnsw = reportAnsw;