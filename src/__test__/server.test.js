'use strict';

const superagent = require('superagent'); //eslint-disable-line
// superagent makes http requests
const server = require('../lib/server');
const Cats = require('../model/cat');

const apiUrl = 'http://localhost:5000/api/v1/cats';

const mockResource = {
  title: 'test title',
  content: 'test content',
  age: 'test age',
  weight: 'test weight', 
  color: 'test color',
};

beforeAll(() => server.start(5000));
afterAll(() => server.stop());

describe('POST to /api/v1/cat', () => {
  test('200 for successful saving of a new cat', () => {
    return superagent.post('localhost:5000/api/v1/cat')
      .send(mockResource)
      .then((response) => {
        expect(response.body.title).toEqual(mockResource.title);
        expect(response.body.content).toEqual(mockResource.content);
        expect(response.body.age).toEqual(mockResource.age);
        expect(response.body.weight).toEqual(mockResource.weight);
        expect(response.body.color).toEqual(mockResource.color);
        expect(response.body._id).toBeTruthy();
        expect(response.status).toEqual(200);
      })
      .catch((err) => {
        // I still want to handle errors in the catch block in case we fail
        throw err;
      });
  });

  test('400 for a bad request', () => {
    return superagent.post(apiUrl)
      .send({})
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        expect(err.status).toEqual(404);
        expect(err).toBeInstanceOf(Error);
      });
  });
});

describe('GET /api/v1/cat', () => {
  let mockResourceForGet;
  beforeEach((done) => { // pass in done to to access id
    const newCat = new Cats(mockResource);
    newCat.save() // go straight to database to store database
      .then((cat) => {
        mockResourceForGet = cat;
        done();
      })
      .catch((err) => {
        throw err;
      });
  }); // mocking a resourse

  test('200 successful GET request', () => {
    return superagent.get(`${apiUrl}?id=${mockResourceForGet._id}`)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(mockResourceForGet.title);
        expect(response.body.content).toEqual(mockResourceForGet.content);
        expect(response.body.age).toEqual(mockResourceForGet.age);
        expect(response.body.weight).toEqual(mockResourceForGet.weight);
        expect(response.body.color).toEqual(mockResourceForGet.color);
        expect(response.body.createdOn).toEqual(mockResourceForGet.createdOn.toISOString());
      })
      .catch((err) => {
        throw err;
      });
  });

  describe('DELETE /api/v1/books', () => {
    let mockResourceForGet; //eslint-disable-line
    beforeAll(() => {
      const newCat = new Cats(mockResource);
      newCat.save()
        .then((cat) => {
          mockResourceForGet = cat;
        })
        .catch((err) => {
          throw err;
        });
    });

    test('200 successful DELETE request', () => {
      return superagent.delete(`${apiUrl}?id=${mockResourceForGet._id}`)
        .then((response) => {
          expect(response.status).toEqual(200);
        })
        .catch((err) => {
          throw err;
        });
    });

    test('404 Failed DELETE request', () => {
      return superagent.delete(`${apiUrl}?id=${mockResourceForGet._id}`)
        .then((err) => {
          throw err;
        })
        .catch((response) => {
          expect(response.status).toEqual(404);
          expect(response.body).toBeUndefined();
        })
        .catch((err) => {
          throw err;
        });
    });
  });
});
