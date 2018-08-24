const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
	fullName: {
    type: String,
    required: true
  },
	emailAddress: {
    type: String,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please enter a valid email address.',
    }
  },
	password: {
    type: String,
    required: true
  }
});

UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ emailAddress: email })
    .exec((error, user) => {
      if (error) {
        return callback(error);
      } else if ( !user ) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password , (error, result) => {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
