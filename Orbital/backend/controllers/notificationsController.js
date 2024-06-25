const webpush = require("web-push");
const schedule = require("node-schedule");
const Subscription = require("../models/subscriptionModel");

const publicVapidKey =
    "BKr2V1iW4iK7ug_Wsp0FRLObRnBgkV7GdPPFoACp7f6sdKH-muu7UMp8pQsdPXCztIf-d3CecoGmffSXffO62cs";
const privateVapidKey = "uL4P-X9UTPFgcowYUWVf5I1J-LpyzgQ3tBwyqbTnjOw";
webpush.setVapidDetails(
    "mailto:test@test.com",
    publicVapidKey,
    privateVapidKey
);

exports.subscribe = async (req, res) => {
    const { subscription, title, message } = req.body;
    const payload = JSON.stringify({ title, message });
    webpush
        .sendNotification(subscription, payload)
        .catch((err) => console.error("err", err));
    res.status(200).json({ success: true });
};

exports.scheduleTaskDeadlineNotification = (task) => {
    const { courseCode, dueDate, user, taskName } = task;
    // console.log(dueDate, taskName);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueToday = dueDate === today.getTime();
    // console.log("dueToday:", dueToday);
    const notificationTime = dueToday
        ? new Date(Date.now() + 10 * 1000) // 10 seconds after current time
        : new Date(dueDate - 24 * 60 * 60 * 1000); // 1 day before due date
    // const notificationTime = new Date(Date.now() + 5 * 1000); // 5 seconds after current time

    schedule.scheduleJob(notificationTime, async () => {
        // const subscription = await getUserSubscription(user);
        const subscriptions = await Subscription.find({ user: user });
        const payload = JSON.stringify({
            title: `Task Deadline Notification - ${courseCode}`,
            message: dueToday
                ? `Your task "${taskName}" is due today!`
                : `Your task "${taskName}" is due in 1 day.`,
        });

        for (const subscription of subscriptions) {
            webpush
                .sendNotification(subscription, payload)
                .catch((err) => console.error(err));
        }
    });
};
