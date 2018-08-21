'use strict';

const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  fullName: {
    type      : String,
    required  : [true, 'The username field has to be filled in.'],
    trim      : true
  },
  emailAddress: {
    type      : String,
    unique    : true,
    required  : [true, 'The email address field has to be filled in'],
    trim      : true
  },
  password: {
    type      : String,
    required  : [true, 'The password field has to be filled in'],
    trim      : true
  }
});

UserSchema.pre('save', function(next) {
  let user = this;
  bcrypt.hash(
    user.password,
    10,
    function(error, hash) {
      if (error) {
        return next(error);
      }
      user.password = hash;
      return next();
    }
  );
});

UserSchema
  .path('emailAddress')
  .validate(
    function(email) {
      return validator.isEmail(email)
    },
    'Invalid email adress'
  );

const User = mongoose.model('User', UserSchema);
module.exports = User;
