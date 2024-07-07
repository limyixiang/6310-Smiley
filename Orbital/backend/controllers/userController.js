const User = require("../models/userModel");
const Subscription = require("../models/subscriptionModel");

//Get By Id
exports.getUserById = (req, res, next, id) => {
    User.findById(id)
        .populate("courses")
        .populate("tasks")
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: "User not found",
                });
            }
            req.profile = user;
            next();
        });
};

exports.getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.__v = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile);
};

exports.updateSubscriptions = async (req, res) => {
    try {
        const { userid, subscription: sub } = req.body;
        // console.log(sub);
        // console.log("Subscription:", subscription);
        const user = await User.findById(userid);
        const subscription = new Subscription({
            endpoint: sub.endpoint,
            user: user,
            keys: {
                auth: sub.keys.auth,
                p256dh: sub.keys.p256dh,
            },
        });
        const existingSubscriptions = await Subscription.find({ user: user });
        // console.log(user);
        if (!user) {
            return res.status(400).json({
                error: "User not found",
            });
        }
        if (!user.subscriptions) {
            user.subscriptions = [subscription];
            await user.save();
            await subscription.save();
        } else {
            // check if subscription already exists
            const exists = existingSubscriptions.some(
                (sub) => sub.endpoint === subscription.endpoint
            );
            if (!exists) {
                // console.log("Current subscriptions:", user.subscriptions);
                user.subscriptions.push(subscription);
                // console.log("Subscription added");
                await user.save();
                await subscription.save();
            }
        }
        // for (const sub of existingSubscriptions) {
        //     console.log(sub.endpoint);
        // }
        return res.status(200).json({
            success: true,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Internal server error.",
        });
    }
};

//Update Profile
exports.profileChange = async (req, res) => {
    try {
        const { name, userid } = req.body;
        const user = await User.findByIdAndUpdate(userid, { name: name });
        // console.log(user);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Error updating profile.",
        });
    }
};
