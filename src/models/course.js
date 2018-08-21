'use strict';

const mongoose    = require('mongoose');
const User        = require('./user');
const Review      = require('./review');

const CourseSchema = new mongoose.Schema({
  user: {
    type      : mongoose.Schema.ObjectId,
    ref       : 'User'
  },
  title: {
    type      : String,
    required  : [true, 'A course must have a title.']
  },
  description: {
    type      : String,
    required  : [true, 'A course must have a description.']
  },
  estimatedTime: {
    type      : String
  },
  materialsNeeded: {
    type      : String
  },
  steps: [{
    stepNumber: Number,
    title: {
      type      : String,
      required  : [true, 'The title of the step is required.']
    },
    description: {
      type      : String,
      required  : [true, 'The description of the step is required.']
    }
  }],
  reviews: [{
    type        : mongoose.Schema.ObjectId,
    ref         : 'Review'
  }]
});

// Set the step number property to the correct format
CourseSchema
    .pre('save', function(next) {
        this.steps = this.steps.map(function (step, index) {
            step.stepNumber = index + 1;
            return step;
        });
        return next();
    });

// Verify if a course has at least one step
CourseSchema
    .path('steps')
    .validate(
      function (steps) {
        return steps.length >= 1;
    },
    'Each course must have at least one step.'
  );

// Get an overal rating for the course
CourseSchema
          .virtual('overallRating')
          .get(function() {
            let numReviews = this.reviews.length;
            let totalScore = 0;
            this.reviews.forEach(function(review) {
              totalScore += review.rating;
            });
            return Math.round(totalScore / numReviews);
          });

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;
