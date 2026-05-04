const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
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