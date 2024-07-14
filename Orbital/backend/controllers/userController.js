const User = require("../models/userModel");
const Subscription = require("../models/subscriptionModel");
const {
    updateUserTasksNotifications,
    updateUserNotificationsTiming,
} = require("./notificationsController");
const { updateUserTasksPriority } = require("./taskController");

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

exports.getUserName = async (req, res) => {
    try {
        // console.log(req.body);
        const { userid } = req.body;
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ data: user.name });
    } catch (err) {
        return res.status(500).json({ error: "Internal server error." });
    }
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
        const { userid, name } = req.body;
        const user = await User.findByIdAndUpdate(userid, {
            name: name,
        });
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

exports.colorThemeChange = async (req, res) => {
    try {
        const { userid, theme } = req.body;
        // console.log(userid, theme);
        const user = await User.findByIdAndUpdate(userid, {
            colorTheme: theme,
        });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error." });
    }
};

exports.getColorTheme = async (req, res) => {
    try {
        const { userid } = req.body;
        // console.log(req.body);
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        return res.status(200).json({ data: user.colorTheme });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error." });
    }
};

exports.updateNotifications = async (req, res) => {
    try {
        const {
            userid,
            notifications,
            notificationsHigh,
            notificationsLow,
            reminderDaysBeforeDeadline,
            reminderTime,
            tutorialPriority,
            lecturePriority,
            quizPriority,
        } = req.body;
        console.log(req.body);
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        const highPreferenceChanged =
            user.notificationsHigh !== notificationsHigh;
        const lowPreferenceChanged = user.notificationsLow !== notificationsLow;
        const tutorialPriorityChanged =
            user.tutorialPriority !== tutorialPriority;
        const lecturePriorityChanged = user.lecturePriority !== lecturePriority;
        const quizPriorityChanged = user.quizPriority !== quizPriority;
        const taskPriorityChanged =
            tutorialPriorityChanged ||
            lecturePriorityChanged ||
            quizPriorityChanged;
        const reminderTimeChanged =
            user.reminderTime.toString() !== reminderTime.toString() ||
            user.reminderDaysBeforeDeadline.toString() !==
                reminderDaysBeforeDeadline.toString();
        user.notifications = notifications;
        user.notificationsHigh = notificationsHigh;
        user.notificationsLow = notificationsLow;
        user.reminderDaysBeforeDeadline = reminderDaysBeforeDeadline;
        user.reminderTime = reminderTime;
        user.tutorialPriority = tutorialPriority;
        user.lecturePriority = lecturePriority;
        user.quizPriority = quizPriority;
        await user.save();
        if (highPreferenceChanged || lowPreferenceChanged) {
            await updateUserTasksNotifications(
                userid,
                highPreferenceChanged,
                lowPreferenceChanged
            );
        }
        if (taskPriorityChanged) {
            console.log("Updating task priority");
            await updateUserTasksPriority(
                userid,
                tutorialPriorityChanged,
                lecturePriorityChanged,
                quizPriorityChanged
            );
        }
        if (reminderTimeChanged) {
            await updateUserNotificationsTiming(userid);
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Internal server error." });
    }
};

exports.getPreferences = async (req, res) => {
    try {
        const { userid } = req.body;
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        return res.status(200).json({
            notifications: user.notifications,
            notificationsHigh: user.notificationsHigh,
            notificationsLow: user.notificationsLow,
            reminderDaysBeforeDeadline: user.reminderDaysBeforeDeadline,
            reminderTime: user.reminderTime,
            tutorialPriority: user.tutorialPriority,
            lecturePriority: user.lecturePriority,
            quizPriority: user.quizPriority,
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error." });
    }
};
