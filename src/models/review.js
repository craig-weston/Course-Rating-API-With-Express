'use strict';
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
	postedOn: {
    type: Date,
    default: Date.now
  },
	rating: {
    type: Number,
    min: 1,
    max: 5
  },
	review: String
},{
  usePushEach: true
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
