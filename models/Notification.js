const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

    _id: String,
    userId: {
        type: String,
        ref: "User"
    },

    type: String,

    title: String,

    message: String,

    read: {
        type: Boolean,
        default: false
    },

    icon: String,

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Notification", notificationSchema);