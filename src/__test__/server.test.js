'use strict';

const superagent = require('superagent'); //eslint-disable-line
const server = require('../lib/server');
const Note = require('../model/note');
const File = require('../model/note');

const apiUrl = 'http://localhost:5000/api/v1/note';

const mockResource = {
  title: 'test title',
  content: 'test content',
};

beforeAll(() => server.start(5432));
afterAll(() => server.stop());

describe('POST to /api/v1/note', () => {
  test('200 for successful saving of a new note', () => {
    return superagent.post(apiUrl)
      .send(mockResource)
      .then((response) => {
        expect(response.body.title).toEqual(mockResource.title);
        expect(response.body.content).toEqual(mockResource.content);
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
        expect(err.status).toEqual(400);
        expect(err).toBeInstanceOf(Error);
      });
  });
});

describe('GET /api/v1/note', () => {
  let mockResourceForGet;
  beforeEach((done) => { // pass in done to to access id
    const newNote = new Note(mockResource);
    newNote.save() // go straight to database to store database
      .then((note) => {
        mockResourceForGet = note;
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
        expect(response.body.createdOn).toEqual(mockResourceForGet.createdOn.toISOString());
      })
      .catch((err) => {
        throw err;
      });
  });

  describe('DELETE /api/v1/books', () => {
    let mockResourceForGet; //eslint-disable-line
    beforeAll(() => {
      const newFile = new File(mockResource);
      newFile.save()
        .then((file) => {
          mockResourceForGet = file;
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
