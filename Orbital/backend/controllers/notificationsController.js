const webpush = require("web-push");
const Agenda = require("agenda");
const Subscription = require("../models/subscriptionModel");
const Task = require("../models/tasksModel");

const publicVapidKey =
    "BKr2V1iW4iK7ug_Wsp0FRLObRnBgkV7GdPPFoACp7f6sdKH-muu7UMp8pQsdPXCztIf-d3CecoGmffSXffO62cs";
const privateVapidKey = "uL4P-X9UTPFgcowYUWVf5I1J-LpyzgQ3tBwyqbTnjOw";
webpush.setVapidDetails(
    "mailto:test@test.com",
    publicVapidKey,
    privateVapidKey
);

const agenda = new Agenda({
    db: {
        address:
            process.env.MONGODB_URI ||
            "mongodb+srv://Smiley:6310-Smiley@6310-smiley.yxgidpp.mongodb.net/?retryWrites=true&w=majority&appName=6310-Smiley",
    },
});

agenda.define("send web push", async (job) => {
    const { subscription, title, message } = job.attrs.data;
    const payload = JSON.stringify({ title, message });
    await webpush
        .sendNotification(subscription, payload)
        .catch((err) => console.error("err", err));
});

// exports.subscribe = async (req, res) => {
//     const { subscription, title, message } = req.body;
//     const payload = JSON.stringify({ title, message });
//     webpush
//         .sendNotification(subscription, payload)
//         .catch((err) => console.error("err", err));
//     res.status(200).json({ success: true });
// };

exports.subscribe = async (req, res) => {
    const { subscription, title, message } = req.body;
    // Schedule the notification immediately upon subscription
    await agenda.schedule("in 10 seconds", "send web push", {
        subscription,
        title,
        message,
    });
    res.status(200).json({ success: true });
};

exports.scheduleTaskDeadlineNotification = async (task) => {
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

    const subscriptions = await Subscription.find({ user: user });
    const title = `Task Deadline Notification - ${courseCode}`;
    const message = dueToday
        ? `Your task "${taskName}" is due today!`
        : `Your task "${taskName}" is due in 1 day.`;
    var jobs = [];
    for (const subscription of subscriptions) {
        const job = await agenda.schedule(notificationTime, "send web push", {
            subscription,
            title,
            message,
        });
        // console.log(job);
        // console.log(job.attrs._id);
        jobs.push(job.attrs._id);
    }
    // console.log(jobs);
    return jobs;
};

// Start Agenda
(async function () {
    await agenda.start();
})();

exports.disableTaskDeadlineNotification = async (taskId) => {
    const task = await Task.findById(taskId);
    const jobs = task.notifications;
    // console.log(jobs);
    for (const jobId of jobs) {
        await agenda.disable({ _id: jobId });
        // console.log("disabled");
    }
};

exports.enableTaskDeadlineNotification = async (taskId) => {
    const task = await Task.findById(taskId);
    const jobs = task.notifications;
    // console.log(jobs);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueToday = task.dueDate.getTime() === today.getTime();
    const newMessage = dueToday
        ? `Your task "${task.taskName}" is due today!`
        : `Your task "${task.taskName}" is due in 1 day.`;
    // const testMessage = "Test Message";
    // console.log(dueToday);
    for (const jobId of jobs) {
        const job = await agenda.jobs({ _id: jobId });
        if (job.length > 0) {
            job[0].attrs.data.message = newMessage;
            await job[0].save();
        }
        await agenda.enable({ _id: jobId });
        // console.log("enabled");
    }
};

exports.deleteTaskDeadlineNotification = async (taskId) => {
    const task = await Task.findById(taskId);
    const jobs = task.notifications;
    // console.log(jobs);
    for (const jobId of jobs) {
        await agenda.cancel({ _id: jobId });
        // console.log("cancelled");
    }
};
