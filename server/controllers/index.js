const models = require('../models');

const getAllQ = (req, res) => {
  let productId = req.params.id;
  models.getQuestions(productId, (err, data) => {
    if (err) {
      console.log(err);
      res.status(404).end();
    }
    res.status(200).send(data);
  })
}

const getAllA = (req, res) => {
  let questionId = req.params.id;
  models.getAnswers(questionId, (err, data) => {
    if (err) {
      console.log(err);
      res.status(404).end();
    }
    res.status(200).send(data)
  })
}

const postQues = (req, res) => {
  models.postQuestion(req.body, (err, data) => {
    if (err) {
      console.log(err);
      res.status(404).end();
    }
    console.log('success,', data);
    res.status(201).send({'CREATED': data});
  })
}

const postAnsw = (req, res) => {
  models.postAnswer(req.body, req.params.id, (err, data) => {
    if (err) {
      console.log(err);
      res.status(404).end();
    }
    // console.log('success', data);
    res.status(201).send({'CREATED': data});
  })
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