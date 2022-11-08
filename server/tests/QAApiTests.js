import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// export const errorRate = new Rate('errors');

export const questionsError = new Rate('/GET questions errors');
export const questionsTrend = new Trend('/GET questions API uptime');
export const answersError = new Rate('/GET answers errors');
export const answersTrend = new Trend('/GET answers API uptime');
export const questionsPostError = new Rate('/POST questions errors');
export const questionsPostTrend = new Trend('/POST questions API uptime');
export const answersPostError = new Rate('/POST answers errors');
export const answersPostTrend = new Trend('/POST answers API uptime');
export const questionsPutHelpError = new Rate('/PUT questions helpful errors');
export const questionsPutHelpTrend = new Trend('/PUT questions helpful API uptime');
export const questionsPutReportError = new Rate('/PUT questions report errors');
export const questionsPutReportTrend = new Trend('/PUT questions report API uptime');
export const answersPutHelpError = new Rate('/PUT answers helpful errors');
export const answersPutHelpTrend = new Trend('/PUT answers helpful API uptime');
export const answersPutReportError = new Rate('/PUT answers report errors');
export const answersPutReportTrend = new Trend('/PUT answers report API uptime');

export const last10PID = randomIntBetween(900011, 1000011);
const vus = 2;

export const options = {
  discardResponseBodies: true,
  // stages: [
  //   { duration: '0.5m', target: 10 },
  //   { duration: '0.5m', target: 10 },
  //   { duration: '0.5m', target: 0 },
  // ],
  scenarios: {
    questions: {
      executor: 'constant-vus',
      exec: 'questions',
      vus: vus,
      duration: '1m',
      tags: { name: 'questionsURL' },
    },
    answers: {
      executor: 'constant-vus',
      exec: 'answers',
      vus: vus,
      duration: '1m',
      tags: { name: 'answersURL' },
    },
    questionsPost: {
      executor: 'constant-vus',
      exec: 'questionsPost',
      vus: vus,
      duration: '1m',
      tags: { name: 'questionsPostURL' },
    },
    answersPost: {
      executor: 'constant-vus',
      exec: 'answersPost',
      vus: vus,
      duration: '1m',
      tags: { name: 'answersPostURL' },
    },
    questionsPutHelp: {
      executor: 'constant-vus',
      exec: 'questionsPutHelp',
      vus: vus,
      duration: '1m',
      tags: { name: 'questionsPutHelpURL' },
    },
    questionsPutReport: {
      executor: 'constant-vus',
      exec: 'questionsPutReport',
      vus: vus,
      duration: '1m',
      tags: { name: 'questionsPutReportURL' },
    },
    answersPutHelp: {
      executor: 'constant-vus',
      exec: 'answersPutHelp',
      vus: vus,
      duration: '1m',
      tags: { name: 'answersPutHelpURL' },
    },
    answersPutReport: {
      executor: 'constant-vus',
      exec: 'answersPutReport',
      vus: vus,
      duration: '1m',
      tags: { name: 'answersPutReportURL' },
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(90)<2000'],
  },
};




const query = {
  id: last10PID,
  page: 1,
  count: 5,
  body: 'this is a body',
  name: 'josh',
  email: 'test@test.com',
  photos: JSON.stringify(['https://images.unsplash.com/photo-1530519729491-aea5b51d1ee1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80']),
}

export function questions() {
  const questionsResponse = http.get(`http://localhost:3000/api/qa/questions?id=${query.id}&page=${query.page}&count=${query.count}`, { tags: { name: 'questionsURL' } });
  questionsTrend.add(questionsResponse.timings.duration);
  check(questionsResponse, {
    'Questions response status is 200': (res) => res.status === 200,
  }) || questionsError.add(1);
  sleep(1);
}
export function answers() {
  const answersResponse = http.get(`http://localhost:3000/api/qa/questions/${query.id}/answers?page=${query.page}&count=${query.count}`, { tags: { name: 'answersURL' } });
  answersTrend.add(answersResponse.timings.duration);
  check(answersResponse, {
    'answers response status is 200': (res) => res.status === 200,
  }) || answersError.add(1);
  sleep(1);
}
export function questionsPost() {
  const body = {
    product_id: query.id,
    body: query.body,
    name: query.name,
    email: query.email,
  };
  const questionsPostResponse = http.post(`http://localhost:3000/api/qa/questions`, body,{ tags: { name: 'questionsPostURL' } });
  questionsPostTrend.add(questionsPostResponse.timings.duration);
  check(questionsPostResponse, {
    'Questions POST response status is 201': (res) => res.status === 201,
  }) || questionsPostError.add(1);
  sleep(1);
}
export function answersPost() {
  const body = {
    product_id: query.id,
    body: query.body,
    name: query.name,
    photos: query.photos
  };
const answersPostResponse = http.post(`http://localhost:3000/api/qa/questions/${query.id}/answers`, body, { tags: { name: 'answersPostURL' } });
  answersPostTrend.add(answersPostResponse.timings.duration);
  check(answersPostResponse, {
    'answers POST response status is 201': (res) => res.status === 201,
  }) || answersPostError.add(1);
  sleep(1);
}
export function questionsPutHelp() {
  const questionsPutHelpResponse = http.put(`http://localhost:3000/api/qa/questions/${query.id}/helpful`, { tags: { name: 'questionsPutHelpURL' } });
  questionsPutHelpTrend.add(questionsPutHelpResponse.timings.duration);
  check(questionsPutHelpResponse, {
    'QuestionsPutHelp response status is 204': (res) => res.status === 204,
  }) || questionsPutHelpError.add(1);
  sleep(1);
}
export function questionsPutReport() {
  const questionsPutReportResponse = http.put(`http://localhost:3000/api/qa/questions/${query.id}/report`, { tags: { name: 'questionsPutReportURL' } });
  questionsPutReportTrend.add(questionsPutReportResponse.timings.duration);
  check(questionsPutReportResponse, {
    'QuestionsPutReport response status is 204': (res) => res.status === 204,
  }) || questionsPutReportError.add(1);
  sleep(1);
}
export function answersPutHelp() {
  const answersPutHelpResponse = http.put(`http://localhost:3000/api/qa/answers/${query.id}/helpful`, { tags: { name: 'answersPutHelpURL' } });
  answersPutHelpTrend.add(answersPutHelpResponse.timings.duration);
  check(answersPutHelpResponse, {
    'answersPutHelp response status is 204': (res) => res.status === 204,
  }) || answersPutHelpError.add(1);
  sleep(1);
}
export function answersPutReport() {
  const answersPutReportResponse = http.put(`http://localhost:3000/api/qa/answers/${query.id}/report`, { tags: { name: 'answersPutReportURL' } });
  answersPutReportTrend.add(answersPutReportResponse.timings.duration);
  check(answersPutReportResponse, {
    'answersPutReport response status is 204': (res) => res.status === 204,
  }) || answersPutReportError.add(1);
  sleep(1);
}

export function handleSummary(data) {
  return {
    "results.html": htmlReport(data),
  };
}

export default function () {
}