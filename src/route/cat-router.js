'use strict';

const Cat = require('../model/cat');
const logger = require('../lib/logger');
const customResponse = require('../lib/response');

module.exports = (router) => {
  router.post('/api/v1/cat', (request, response) => {
    logger.log(logger.INFO, 'ROUTE-CAT: POST /api/v1/cat');
    const newCat = new Cat(request.body);
    newCat.save()
      .then((cat) => {
        customResponse.sendJSON(response, 200, cat);
        return undefined;
      })
      .catch((err) => {
        logger.log(logger.INFO, `ROUTE CAT: There was a bad request ${JSON.stringify(err.message)}`);
        customResponse.sendError(response, 400, err.message);
        return undefined;
      });
  });

  // /api/v1/cat?id=12335
  router.get('/api/v1/cat', (request, response) => {
    if (!request.url.query.id) {
      customResponse.sendError(response, 404, 'Your request requires an id');
      return undefined;
    }

    Cat.findById(request.url.query.id)
      .then((cat) => {
        customResponse.sendJSON(response, 200, cat);
      })
      .catch((err) => {
        customResponse.sendError(response, 404, err.message);
      });
    return undefined;
  });
  

  router.delete('/api/v1/cat', (request, response) => {
    logger.log(logger.INFO, 'ROUTE-CAT: DELETE /api/v1/cat');

    if (!request.url.query.id) {
      customResponse.sendError(response, 404, 'ID is needed');
      return undefined;
    }

    Cat.delete(request.url.query.id)
      .then((catId) => {
        customResponse.sendJSON(response, 204, catId);
      })
      .catch((err) => {
        customResponse.sendError(response, 404, err.message);
      });
    return undefined;
  });
};
