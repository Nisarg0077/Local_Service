const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },

    category: String,

    providerId: {
        type: String
    },

    price: Number,

    priceType: {
        type: String,
        enum: ["fixed", "starting"]
    },

    rating: Number,

    reviewCount: Number,

    description: String,

    includes: [String],

    image: String,

    duration: String,

    popular: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Service", serviceSchema);