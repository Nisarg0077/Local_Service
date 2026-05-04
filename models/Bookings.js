const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    bookingId: String,

    customerId: {
        type: String,
        // ref: "User"
    },

    providerId: {
        type: String,
        // ref: "Provider"
    },

    serviceId: {
        type: String,
        // ref: "Service"
    },

    date: Date,

    time: String,

    status: {
        type: String,
        enum: ["Pending", "Accepted", "Completed", "Cancelled"],
        default: "Pending"
    },

    amount: Number,

    address: String,

    note: String,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Bookings", bookingSchema);