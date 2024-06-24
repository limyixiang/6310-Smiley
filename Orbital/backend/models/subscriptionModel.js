const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
    endpoint: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    keys: {
        auth: {
            type: String,
            required: true,
        },
        p256dh: {
            type: String,
            required: true,
        },
    },
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
