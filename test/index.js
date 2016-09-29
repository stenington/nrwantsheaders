var test = require('tape');
var request = require('supertest');
var nock = require('nock');

var app = require('../server')({
  WEBHOOK_PATH_1: 'path1',
  WEBHOOK_PATH_2: 'path2',
  NEW_RELIC_APP_ID_1: 'id1',
  NEW_RELIC_APP_ID_2: 'id2',
  NEW_RELIC_KEY_1: 'key1',
  NEW_RELIC_KEY_2: 'key2',
});

test('correctly handles POST to /path1', function (t) {
  var newrelic = nock('https://api.newrelic.com', {
      reqheaders: {
        'X-Api-Key': 'key1' // NEW_RELIC_KEY_1 value
      }
    })
    .post('/v2/applications/id1/deployments.json') // NEW_RELIC_APP_ID_1 value
    .reply(200, {
      data: 'fake nr reply'
    });

  request(app)
    .post('/path1') // WEBHOOK_PATH_1 value
    .expect(200)
    .end(function (err, res) {
      t.error(err, 'no error');
      t.ok(newrelic.isDone(), 'new relic request ok');
      t.end();
    });
});

test('correctly handles POST to /path2', function (t) {
  var newrelic = nock('https://api.newrelic.com', {
      reqheaders: {
        'X-Api-Key': 'key2' // NEW_RELIC_KEY_2 value
      }
    })
    .post('/v2/applications/id2/deployments.json') // NEW_RELIC_APP_ID_2 value
    .reply(200, {
      data: 'fake nr reply'
    });

  request(app)
    .post('/path2') // WEBHOOK_PATH_2 value
    .expect(200)
    .end(function (err, res) {
      t.error(err, 'no error');
      t.ok(newrelic.isDone(), 'new relic request ok');
      t.end();
    });
});

test('other POSTs 404', function (t) {
  request(app)
    .post('/other')
    .expect(404)
    .end(function (err, res) {
      t.error(err, 'no error');
      t.end();
    });
});

test('all GETs 404', function (t) {
  request(app)
    .get('/path1')
    .expect(404)
    .end(function (err, res) {
      t.error(err, 'no error');
    });

  request(app)
    .get('/path2')
    .expect(404)
    .end(function (err, res) {
      t.error(err, 'no error');
    });

  request(app)
    .get('/other')
    .expect(404)
    .end(function (err, res) {
      t.error(err, 'no error');
      t.end();
    });
});
