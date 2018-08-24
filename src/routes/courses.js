"use-strict";

const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Course = require("../models/course");
const Review = require("../models/review");

const mid = require('../middleware');

router.get('/', (req, res, next) => {
  Course.find({}, '_id title')
    .exec((err, courses) => {
      if (err) {
        return next(err);
      } else {
        res.status(200);
        return res.json(courses);
      }
    })
});

router.get('/:courseId', (req, res, next) => {
  Course.findById(req.params.courseId)
    .populate('user')
    .populate('reviews')
    .exec((err, course) => {
      if (err) {
        return next(err);
      } else {
        res.status(200);
        return res.json(course);
      }
    })
});

router.post('/', mid.authUser, (req, res, next) => {
  const course = new Course(req.body);
  course.save((err, course) => {
    if (err) {
      return next(err);
    } else {
      res.location('/');
      res.status(201).json();
    }
  })
});

router.put('/:courseId', mid.authUser, (req, res, next) => {
  Course.findByIdAndUpdate(req.params.courseId, {$set: req.body}, (err,course) => {
		if (err) {
			return next(err);
		} else {
      res.status(204).json();
    }
	})
});

router.post('/:courseId/reviews', mid.authUser, (req, res, next) => {
  Course.findById(req.params.courseId)
  .populate('user')
  .populate('reviews')
  .exec((err,course) => {
    if (err) return next(err);
    const review = new Review(req.body);
    course.reviews.push(review);
    review.save(err => {
      if (err) return next(err);
      course.save(err => {
        if (err) return next(err);
        res.location('/');
        res.status(201).json();
      })
    })
  })
})

module.exports = router;
