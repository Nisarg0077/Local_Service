const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  providerId: {
    type: String
  },

  name: String,
  email: String,
  password: String,
  phone: String,

  business: String,

  category: {
    type: String,
    enum: [
      "Electrician",
      "Plumber",
      "AC Repair",
      "Cleaning",
      "Painting",
      "Carpentry",
      "Pest Control",
      "Appliances"
    ]
  },

  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },

  experience: Number,
  area: String,

  avatar: String,

  isAvailable: {
    type: Boolean,
    default: true
  },

  completedJobs: {
    type: Number,
    default: 0
  },

  earnings: {
    type: Number,
    default: 0
  },

  bio: String,

  verifiedBadge: {
    type: Boolean,
    default: false
  },

  joinedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Provider", providerSchema);