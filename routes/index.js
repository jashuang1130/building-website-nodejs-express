const express = require('express');

const speakersRoute = require('./speakers');
const feedbackRoute = require('./feedback');

const router = express.Router();

// router.get('/', (request, response) => {
//   response.render('pages/index', { pageTitle: 'Welcome' });
// });
// module.exports = router;

// return router object with route defined on it

module.exports = params => {
  const { speakersService } = params;

  router.get('/', async (request, response, next) => {
    try {
      const artwork = await speakersService.getAllArtwork();
      const topSpeakers = await speakersService.getList();
      // if (!request.session.visitcount) {
      //   request.session.visitcount = 0;
      // }
      // request.session.visitcount += 1;
      // console.log(`Number of visits ${request.session.visitcount}`);

      // response.render('pages/index', { pageTitle: 'Welcome' });
      return response.render('layout', { pageTitle: 'Welcome', template: 'index', topSpeakers, artwork });
    } catch(err) {
      return next(err);
    }
  });

  router.use('/speakers', speakersRoute(params));
  router.use('/feedback', feedbackRoute(params));

  return router;
};
