const webpush = require("web-push");
const Agenda = require("agenda");
const Subscription = require("../models/subscriptionModel");
const Task = require("../models/tasksModel");
const User = require("../models/userModel");
const WebPushError = require("web-push").WebPushError;

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
    try {
        await webpush.sendNotification(subscription, payload);
    } catch (error) {
        if (error instanceof WebPushError && error.statusCode === 410) {
            const user = await User.findById(subscription.user);
            console.log("Subscription is no longer valid.");
            await Subscription.findByIdAndDelete(subscription._id);
            user.subscriptions.filter(
                (subscription) => subscription !== subscription._id
            );
            await user.save();
            console.log("Expired subscription removed.");
        } else {
            console.log(error);
        }
    }
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

agenda.define("scheduleWeeklySummaryNotification", async () => {
    const users = await User.find();
    console.log("scheduling weekly summary notification");
    // const users = await User.find({ email: "test@gmail.com" });
    // const users = await User.find({ email: "e1121685@u.nus.edu" });
    // const users = await User.find({ email: "e1157341@u.nus.edu" });

    for (const user of users) {
        const subscriptions = user.subscriptions;
        // console.log(subscriptions.length);
        if (subscriptions.length === 0 || user.notifications === false) {
            continue;
        }
        // Calculate the start of the current week (Monday at 00:00)
        const startOfWeek = new Date();
        startOfWeek.setUTCHours(-8, 0, 0, 0);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 7);
        endOfWeek.setUTCMilliseconds(endOfWeek.getUTCMilliseconds() - 1);
        // console.log(startOfWeek, endOfWeek);

        const userTasks = await Task.find({
            _id: { $in: user.tasksByDate },
        }).then((tasks) =>
            tasks.filter(
                (task) =>
                    task.dueDate >= startOfWeek && task.dueDate < endOfWeek
            )
        );
        const taskCount = userTasks.length;
        // console.log(taskCount);

        if (taskCount === 0) {
            continue;
        }

        const completedTaskCount = userTasks.filter(
            (task) => task.status === "Done"
        ).length;

        const remainingTaskCount = taskCount - completedTaskCount;

        const title = "Weekly Task Summary";
        const message =
            taskCount === completedTaskCount
                ? "Congratulations! You completed all tasks this week!"
                : `You completed ${completedTaskCount} out of ${taskCount} ${
                      taskCount == 1 ? "task" : "tasks"
                  } this week! Remember to finish the remaining ${remainingTaskCount} ${
                      remainingTaskCount == 1 ? "task" : "tasks"
                  }!`;
        console.log(message);
        for (const subscription_id of subscriptions) {
            const subscription = await Subscription.findById(subscription_id);
            if (subscription == null) {
                continue;
            }
            // console.log(subscription);
            try {
                await agenda.schedule("in 1 seconds", "send web push", {
                    subscription,
                    title,
                    message,
                });
            } catch (error) {
                console.log(error);
            }
        }
    }
});

// Start Agenda
(async function () {
    await agenda.start();
    await agenda.every("0 9 * * 0", "scheduleWeeklySummaryNotification");
    // await agenda.every("20 20 * * 6", "scheduleWeeklySummaryNotification"); // testing
})();

agenda.on("success", async (job) => {
    try {
        if (job.attrs.data.title === "Weekly Task Summary") {
            await job.remove();
        }
    } catch (error) {
        console.log(error);
    }
});

exports.scheduleTaskDeadlineNotification = async (task) => {
    const { courseCode, dueDate, userid, taskName, taskPriority } = task;
    // console.log(dueDate, taskName);
    const user = await User.findById(userid);
    const today = new Date();
    today.setUTCHours(-8, 0, 0, 0);
    const dueToday = dueDate === today.getTime();
    // console.log("dueToday:", dueToday);
    const notificationTime = dueToday
        ? new Date(Date.now() + 0 * 1000) // 0 seconds after current time
        : // : new Date(dueDate - 24 * 60 * 60 * 1000); // 1 day before due date
          new Date(
              dueDate -
                  user.reminderDaysBeforeDeadline * 24 * 60 * 60 * 1000 +
                  user.reminderTime * 60 * 60 * 1000
          ); // user-defined time before due date
    // const notificationTime = new Date(Date.now() + 5 * 1000); // 5 seconds after current time
    // console.log(notificationTime);
    const daysBetweenDueDateAndToday =
        (dueDate - today) / (24 * 60 * 60 * 1000);
    const messageHelper =
        daysBetweenDueDateAndToday < user.reminderDaysBeforeDeadline
            ? daysBetweenDueDateAndToday
            : user.reminderDaysBeforeDeadline;
    const subscriptions = await Subscription.find({ user: userid });
    const title = `Task Deadline Notification - ${courseCode}`;
    const message =
        dueToday || user.reminderDaysBeforeDeadline === 0
            ? `Your task "${taskName}" is due today!`
            : `Your task "${taskName}" is due in ${messageHelper} ${
                  messageHelper <= 1 ? "day" : "days"
              }.`;
    var jobs = [];
    for (const subscription of subscriptions) {
        if (subscription == null) {
            continue;
        }
        try {
            const job = await agenda.schedule(
                notificationTime,
                "send web push",
                {
                    subscription,
                    title,
                    message,
                }
            );
            // console.log(job);
            // console.log(job.attrs._id);
            jobs.push(job.attrs._id);
            if (taskPriority === "High" && user.notificationsHigh === false) {
                await agenda.disable({ _id: job.attrs._id });
            } else if (
                taskPriority === "Low" &&
                user.notificationsLow === false
            ) {
                await agenda.disable({ _id: job.attrs._id });
            }
        } catch (error) {
            console.log(error);
        }
    }
    // console.log(jobs);
    return jobs;
};

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
    const user = await User.findById(task.user._id);
    const jobs = task.notifications;
    // console.log(jobs);
    const today = new Date();
    today.setUTCHours(-8, 0, 0, 0);
    const dueToday = task.dueDate.getTime() === today.getTime();
    const expired = task.dueDate.getTime() < today.getTime();
    const daysLeft = (task.dueDate - today) / (24 * 60 * 60 * 1000);
    const newMessage = dueToday
        ? `Your task "${task.taskName}" is due today!`
        : expired
        ? `Your task "${task.taskName}" is overdue!`
        : daysLeft <= user.reminderDaysBeforeDeadline
        ? `Your task "${task.taskName}" is due in ${daysLeft} ${
              daysLeft === 1 ? "day" : "days"
          }.`
        : `Your task "${task.taskName}" is due in ${user.reminderDaysBeforeDeadline} days.`;
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

exports.updateUserTasksNotifications = async (
    userid,
    highPreferenceChanged,
    lowPreferenceChanged
) => {
    const user = await User.findById(userid);
    const userTasks = await Task.find({ _id: { $in: user.tasksByDate } });
    for (const task of userTasks) {
        if (task.status === "Done") {
            continue;
        } else {
            if (highPreferenceChanged && task.priority === "High") {
                if (user.notificationsHigh === false) {
                    await exports.disableTaskDeadlineNotification(task._id);
                } else {
                    await exports.enableTaskDeadlineNotification(task._id);
                }
            } else if (lowPreferenceChanged && task.priority === "Low") {
                if (user.notificationsLow === false) {
                    await exports.disableTaskDeadlineNotification(task._id);
                } else {
                    await exports.enableTaskDeadlineNotification(task._id);
                }
            }
        }
    }
};

exports.updateUserNotificationsTiming = async (userid) => {
    const user = await User.findById(userid);
    const userTasks = await Task.find({ _id: { $in: user.tasksByDate } });
    const now = new Date();
    now.setUTCHours(-8, 0, 0, 0);
    for (const task of userTasks) {
        const jobs = task.notifications;
        const daysLeft = (task.dueDate - now) / (24 * 60 * 60 * 1000);
        if (daysLeft < 0) {
            continue;
        }
        // console.log(daysLeft);
        for (const jobId of jobs) {
            const job = await agenda.jobs({ _id: jobId });
            if (job.length > 0) {
                // if we want to prevent rescheduling of jobs that have already been executed
                // if (
                //     job[0].attrs.nextRunAt === null ||
                //     job[0].attrs.nextRunAt < now ||
                //     job[0].attrs.lastFinishedAt !== null
                // ) {
                //     // console.log("Job has already been executed.");
                //     // console.log(job);
                //     continue; // Skip this job as it's considered finished
                // }
                const notificationTime = new Date(
                    task.dueDate -
                        user.reminderDaysBeforeDeadline * 24 * 60 * 60 * 1000 +
                        user.reminderTime * 60 * 60 * 1000
                );
                job[0].attrs.nextRunAt = notificationTime;
                if (daysLeft <= user.reminderDaysBeforeDeadline) {
                    if (daysLeft === 0) {
                        job[0].attrs.data.message = `Your task "${task.taskName}" is due today!`;
                    } else {
                        job[0].attrs.data.message = `Your task "${
                            task.taskName
                        }" is due in ${daysLeft} ${
                            daysLeft === 1 ? "day" : "days"
                        }.`;
                    }
                } else {
                    job[0].attrs.data.message = `Your task "${task.taskName}" is due in ${user.reminderDaysBeforeDeadline} days.`;
                }
                await job[0].save();
            }
        }
    }
};

// Define the gracefulShutdown function
const gracefulShutdown = async () => {
    console.log("Shutting down gracefully...");
    await agenda.stop();
    await agenda.close();
    console.log("Agenda stopped, exiting...");
    // process.exit(0);
};

// Attach graceful shutdown to relevant signals, e.g., SIGINT from pressing Ctrl+C
process.on("SIGINT", gracefulShutdown);

// Gracefully stopping Agenda
exports.gracefulShutdown = gracefulShutdown;
