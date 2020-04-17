const express = require('express');

const router = express.Router();

module.exports = params => {
  //   destructuring assignment; same as const speakersService = params.speakerService
  const { speakersService } = params;

  router.get('/', async (request, response) => {
    const speakers = await speakersService.getList();
    return response.json(speakers);
  });

  router.get('/:shortname', (request, response) => {
    return response.send(`Detail page of ${request.params.shortname}`);
  });

  return router;
};
