const User = require('./controllers/user');

const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignIn = passport.authenticate('local', {session: false});

module.exports = function (app) {

  app.post('/signup', User.signup);
  app.post('/signin', User.signin);

}