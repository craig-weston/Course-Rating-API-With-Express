'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const requireAuth = function(req, res, next) {
  // We create the exception handler
  const unauthorized = new Error('Unauthorized User');
  unauthorized.status = (401);

  let credentials = auth(req);
  if (credentials && credentials.name && credentials.pass) {

    User
      .findOne({ emailAddress: credentials.name })
      .exec(function (err, user) {
        if (err || !user) return next(unauthorized);

        // if found, check for a password match
        bcrypt.compare(credentials.pass, user.hashedPassword, function (err, check) {
          // Attach the user id to the request and continue
          if (check) {
            req.userId = user._id;
            return next();
          }
          return next(unauthorized);
        });
      });


    } else {
      // no credentials in the authorization header
      return next(unauthorized);
    }
}

module.exports.requireAuth = requireAuth;
