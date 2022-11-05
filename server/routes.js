const controllers = require('./controllers/index.js');
const router = require('express').Router();

// QUESTIONS AND ANSWERS REQUESTS ---------------------------------------
// get all info
router.get('/qa/questions/:id', controllers.getAllQ);
router.get('/qa/questions/:id/answers', controllers.getAllA);
// // post new info
router.post('/qa/questions', controllers.postQues);
router.post('/qa/questions/:id/answers', controllers.postAnsw);
// // change helpfulness and report
router.put('/qa/questions/:id/helpful', controllers.helpfulQues);
router.put('/qa/questions/:id/report', controllers.reportQues);

router.put('/qa/answers/:id/helpful', controllers.helpfulAnsw);
router.put('/qa/answers/:id/report', controllers.reportAnsw);


module.exports = router;