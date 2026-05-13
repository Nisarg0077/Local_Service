const mongoose = require("mongoose");

const cookieSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7 * 24 * 60 * 60 // Auto-delete after 7 days in MongoDB
  }
});

// Index for faster queries by uid
cookieSchema.index({ uid: 1, createdAt: -1 });

module.exports = mongoose.model("Cookie", cookieSchema);
