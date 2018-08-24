const User = require('../models/user');
const auth = require('basic-auth');

function authUser (req, res, next) {
  const user = auth(req);
  if (!user) {
    const err = new Error();
    err.message = 'Please log in.';
    err.status = 401;
    return next(err);
  } else {
    User.authenticate(user.name, user.pass, (err, user) => {
      if (err) {
        const err = new Error();
        err.message = 'Incorrect credentials.';
        err.status = 403;
        return next(err);
      } else {
        req.user = user;
        next();
      }
    })
  }
}

module.exports.authUser = authUser;
