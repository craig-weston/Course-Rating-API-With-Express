"use strict";

const express = require("express");
const router = express.Router();

const User = require("../models/user");
const mid = require('../middleware');

router.get('/', mid.authUser, (req,res,next) => {
  res.json(req.user);
  res.status(200);
})

router.post('/', (req,res,next) => {
  const data = {
    fullName: req.body.fullName,
    emailAddress: req.body.emailAddress,
    password: req.body.password
    }
  User.findOne({emailAddress: req.body.emailAddress})
    .exec((err, user) => {
      if (err) return next(err);
      if (user) {
        const err = new Error();
        err.message = 'Email address already exists.';
        err.status = 401;
        return next(err);
      } else {
        User.create(data, (err, user) => {
          if (err) {
            return res.json(err);
          } else {
            res.location('/');
            res.status(201).json();
          }
        })
      }
    })
})

module.exports = router;
