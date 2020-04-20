const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');

const FeedbackService = require('./services/FeedbackService');
const SpeakersService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakersService = new SpeakersService('./data/speakers.json');

const routes = require('./routes');

const app = express();

const port = 3000; // convention that express listen on 3000

app.set('trust proxy', 1); // make express trust cookies passed through reversed proxy

app.use(
  cookieSession({
    name: 'session',
    keys: ['asssdf151s65df4s56f4f', 'th465d4fgdf5g4d6fg5'],
  })
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.locals.siteName = 'ROUX Meetups';

// add middleware, find file under ./static
app.use(express.static(path.join(__dirname, './static')));

// General rule: Never throw error from express routes in middleware because it can bring down your application
// app.get('/throw', (request, response, next) => {
//   setTimeout(() => {
//     return next(new Error('Something did throw!'));
//   }, 500);
// });

// moving to router/index.js
// app.get('/', (request, response) => {
//   // response.send('Hello Express :)');
//   // response.sendFile(path.join(__dirname, './static/index.html'));
//   response.render('pages/index', { pageTitle: 'Welcome' });
// });

// app.get('/speakers', (request, response) => {
//   response.sendFile(path.join(__dirname, './static/speakers.html'));
// });

// catch all for everything under '/'
// app.use('/', routes());
// app.use('/speakers', speakerRoutes());

app.use(async (request, response, next) => {
  try {
    const names = await speakersService.getNames();
    response.locals.speakerNames = names;
    return next();
  } catch (err) {
    return next(err);
  }
});

app.use(
  '/',
  routes({
    feedbackService,
    speakersService,
  })
);

app.use((request, response, next) => {
  return next(createError(404, 'File not found'));
});

app.use((err, request, response, next) => {
  response.locals.message = err.message;
  console.error(err);
  const status = err.status || 500;
  response.locals.status = status;
  response.status(status);
  response.render('error');
});

app.listen(port, () => {
  console.log(`server listening on port ${port}...`);
});
