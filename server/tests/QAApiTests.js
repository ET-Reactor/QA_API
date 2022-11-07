import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate } from 'k6/metrics';

export const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '0.5m', target: 5 },
    // { duration: '1m', target: 5 },
    // { duration: '0.5m', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000'],
  }
};

export default function () {
  const query = {
    id: 1,
    page: 1,
    count: 5,
    body: 'this is a body',
    name: 'josh',
    email: 'test@test.com',
    photos: JSON.stringify(['https://images.unsplash.com/photo-1530519729491-aea5b51d1ee1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80']),
  }
  const req1 = {
    method: 'GET',
    url: `http://localhost:3000/api/qa/questions?id=${query.id}&page=${query.page}&count=${query.count}`
  };
  const req2 = {
    method: 'GET',
    url: `http://localhost:3000/api/qa/questions/${query.id}/answers?page=${query.page}&count=${query.count}`
  };
  const req3 = {
    method: 'POST',
    url: `http://localhost:3000/api/qa/questions`,
    body: {
      product_id: query.id,
      body: query.body,
      name: query.name,
      email: query.email,
    }
  };
  const req4 = {
    method: 'POST',
    url: `http://localhost:3000/api/qa/questions/${query.id}/answers`,
    body: {
      body: query.body,
      name: query.name,
      email: query.email,
      photos: query.photos
    }
  };
  const req5 = {
    method: 'PUT',
    url: `http://localhost:3000/api/qa/questions/${query.id}/helpful`,
  }
  const req6 = {
    method: 'PUT',
    url: `http://localhost:3000/api/qa/questions/${query.id}/report`,
  }
  const req7 = {
    method: 'PUT',
    url: `http://localhost:3000/api/qa/answers/${query.id}/helpful`,
  }
  const req8 = {
    method: 'PUT',
    url: `http://localhost:3000/api/qa/answers/${query.id}/report`,
  }

  const responses = http.batch([req1, req2, req3, req4, req5, req6, req7, req8]);

  check(responses[0], {
    'status is 200 for GET /qa/questions': (res) => res.status === 200,
    'get response body is defined for GET /qa/questions': (res) => res.body !== undefined,
  }) || errorRate.add(1);
  check(responses[1], {
    'status is 200 for GET /qa/questions/:question_id/answers': (res) => res.status === 200,
    'get response body is defined for GET /qa/questions/:question_id/answers': (res) => res.body !== undefined,
  }) || errorRate.add(1);
  sleep(1);
  check(responses[2], {
    'status is 201 for POST /qa/questions': (res) => res.status === 201,
  }) || errorRate.add(1);
  sleep(1);
  check(responses[3], {
    'status is 201 for POST /qa/questions/:question_id/answers': (res) => res.status === 201,
  }) || errorRate.add(1);
  sleep(1);
  check(responses[4], {
    'status is 204 for PUT /aq/questions/:question_id/helpful': (res) => res.status === 204,
  }) || errorRate.add(1);
  sleep(1);
  check(responses[5], {
    'status is 204 for PUT /aq/questions/:question_id/report': (res) => res.status === 204,
  }) || errorRate.add(1);
  sleep(1);
  check(responses[6], {
    'status is 204 for PUT /aq/answers/:answer_id/helpful': (res) => res.status === 204,
  }) || errorRate.add(1);
  sleep(1);
  check(responses[7], {
    'status is 204 for PUT /aq/answers/:answer_id/report': (res) => res.status === 204,
  }) || errorRate.add(1);
  sleep(1);
}