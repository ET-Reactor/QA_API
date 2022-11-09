const models = require('../models');

const getAllQ = (req, res) => {
  console.log('request received')
  const queries = {};
  queries.id = req.query.id;
  queries.page = req.query.page ?? 1;
  queries.count = req.query.count ?? 5;

  models.getQuestions(queries, (err, data) => {
    if (err) {
      console.log(err);
      res.status(404).end();
    }
    console.log(data)
    res.status(200).send(data);
  })
}

const getAllA = (req, res) => {
  const queries = {};
  queries.id = req.params.id;
  queries.page = req.query.page ?? 1;
  queries.count = req.query.count ?? 5;

  models.getAnswers(queries, (err, data) => {
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
    res.status(201).send({'CREATED': data});
  })
}

const postAnsw = (req, res) => {
  models.postAnswer(req.body, req.params.id, (err, data) => {
    if (err) {
      console.log(err);
      res.status(404).end();
    }
    res.status(201).send({'CREATED': data});
  })
}
const helpfulQues = (req, res) => {
  models.putHelpfulQuestion(req.params.id, (err, data) => {
    if (err) {
      console.log(err);
      res.status(404).end();
    }
    res.status(204).end();
  })
}
const reportQues = (req, res) => {
  models.putReportQuestion(req.params.id, (err, data) => {
    if (err) {
      console.log(err);
      res.status(404).end();
    }
    res.status(204).end();
  })
}
const helpfulAnsw = (req, res) => {
  models.putHelpfulAnswer(req.params.id, (err, data) => {
    if (err) {
      console.log(err);
      res.status(404).end();
    }
    res.status(204).end();
  })
}
const reportAnsw = (req, res) => {
  models.putReportAnswer(req.params.id, (err, data) => {
    if (err) {
      console.log(err);
      res.status(404).end();
    }
    res.status(204).end();
  })
}

module.exports.getAllQ = getAllQ;
module.exports.getAllA = getAllA;
module.exports.postQues = postQues;
module.exports.postAnsw = postAnsw;
module.exports.helpfulQues = helpfulQues;
module.exports.reportQues = reportQues;
module.exports.helpfulAnsw = helpfulAnsw;
module.exports.reportAnsw = reportAnsw;