const jwt = require('jsonwebtoken');
const User = require('../models/user');

export const tokenForUser = function(user) {
  const timestamp = new Date().getTime();
  return jwt.sign({sub: user.id, iat: timestamp}, process.env.SECRET || 'apollo-test')
}

exports.signin = function (req, res, next) {
  User.findOne({username: req.body.username})
  .then(user => {
    if (!user) {
      res.status(401).send({error: 'Authentication failed. User not found.'});
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          res.json({success: true, token: tokenForUser(user)});
        } else {
          res.status(401).send({error: 'Authentication failed. Wrong password.'});
        }
      });
    }
  })
  .catch(err => {throw err;});
}

exports.signup = function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(401).send({error: 'You must provide username and password'});
  } else {
    const user = new User({username, password});

    user.save()
    .then(() => res.json({success: true, msg: 'Successful created new user.'}))
    .catch((err) => res.status(401).send({error: 'Username already exists.'}));

  };
}

exports.list = function (req, res, next) {
  User.find({}, "-password").then((list) => {
    res.json({success: true, list: list.map(item => {return {id: item.id, username: item.username}})});
  })
}