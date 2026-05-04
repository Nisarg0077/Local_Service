const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
  serviceId: {
    type: Number,
  },

  userId: {
    type: String,
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
  },

  comment: String,

  approved: {
    type: Boolean,
    default: false,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
