const request = require("supertest");
const app = require("../../app");
const User = require("../../models/userModel");
const Course = require("../../models/courseModel");
const Task = require("../../models/tasksModel");
const {
    gracefulShutdown,
} = require("../../controllers/notificationsController");

// Access Test Database
const mongoose = require("mongoose");
var mongoDB =
    "mongodb+srv://Smiley:6310-Smiley@6310-smiley.yxgidpp.mongodb.net/integrationTestingTask?retryWrites=true&w=majority&appName=6310-Smiley";

const PORT = 8003;

let server;
let userid;
let courseid;

beforeAll(async () => {
    mongoose
        .connect(mongoDB)
        .then(() => console.log("Test Database connected successfully"))
        .catch((err) => console.log("Test Database connection failed", err));
    await Task.deleteMany({});
    await Course.deleteMany({});
    await User.deleteMany({});
    server = app.listen(PORT);
});

afterAll(async () => {
    await User.deleteMany({});
    await Course.deleteMany({});
    await Task.deleteMany({});
    await mongoose.connection.close();
    await server.close();
    await gracefulShutdown();
});

describe("task route testing", () => {
    beforeAll(async () => {
        await request(server)
            .post("/api/signup")
            .send({
                name: "foo",
                email: "foo@gmail.com",
                password: "Foobar123",
            })
            .then(async (res) => {
                userid = res.body.id;
                await request(server)
                    .post("/courses/createcourse")
                    .send({
                        courseName: "bar",
                        courseCode: "BAR123",
                        userid: userid,
                        courseOrder: ["temp"],
                        tasks: [],
                    })
                    .then((res) => {
                        courseid = res.body.data._id;
                    });
            });
    });

    it("can create a task", async () => {
        await request(server)
            .post("/tasks/createtask")
            .send({
                taskName: "fooo",
                dueDate: "2024-05-30",
                priority: "High",
                courseid: courseid,
                userid: userid,
            })
            .expect(201);
    }),
        it("returns an error when creating a task with an empty task name input", async () => {
            await request(server)
                .post("/tasks/createtask")
                .send({
                    taskName: "",
                    dueDate: "2024-05-30",
                    priority: "High",
                    courseid: courseid,
                    userid: userid,
                })
                .expect(422);
        }),
        it("returns an error when creating a task with an empty due date input", async () => {
            await request(server)
                .post("/tasks/createtask")
                .send({
                    taskName: "fooo",
                    dueDate: "",
                    priority: "High",
                    courseid: courseid,
                    userid: userid,
                })
                .expect(422);
        }),
        it("returns an error when creating a task with an invalid due date input", async () => {
            await request(server)
                .post("/tasks/createtask")
                .send({
                    taskName: "fooo",
                    dueDate: "bar",
                    priority: "High",
                    courseid: courseid,
                    userid: userid,
                })
                .expect(422);
        }),
        it("returns an error when creating a task with an empty priority input", async () => {
            await request(server)
                .post("/tasks/createtask")
                .send({
                    taskName: "fooo",
                    dueDate: "2024-05-30",
                    priority: "",
                    courseid: courseid,
                    userid: userid,
                })
                .expect(422);
        });

    it("can complete a task", async () => {
        const res = await Task.findOne({ taskName: "fooo" });
        const taskid = res._id;
        await request(server)
            .post("/tasks/completetask")
            .send({ taskid: taskid })
            .expect(200);
    }),
        it("does not return an error when a task is already completed", async () => {
            const res = await Task.findOne({ taskName: "fooo" });
            expect(res.status).toEqual("Done");
            const taskid = res._id;
            await request(server)
                .post("/tasks/completetask")
                .send({ taskid: taskid })
                .expect(200);
        });

    it("can reverse complete a task", async () => {
        const res = await Task.findOne({ taskName: "fooo" });
        const taskid = res._id;
        await request(server)
            .post("/tasks/reversecompletetask")
            .send({ taskid: taskid })
            .expect(200);
    }),
        it("does not return an error when a task is already not completed", async () => {
            const res = await Task.findOne({ taskName: "fooo" });
            expect(res.status).toEqual("Todo");
            const taskid = res._id;
            await request(server)
                .post("/tasks/reversecompletetask")
                .send({ taskid: taskid })
                .expect(200);
        });

    it("can delete a task", async () => {
        const res = await Task.findOne({ taskName: "fooo" });
        const taskid = res._id;
        await request(server).delete(`/tasks/deletetask/${taskid}`).expect(200);
    }),
        it("returns an error when deleting a task with an invalid task id", async () => {
            await request(server).delete("/tasks/deletetask/123").expect(500);
        });

    describe("fetch tasks in the correct order", () => {
        let expectedOrderByDate, expectedOrderByPriority;
        beforeAll(async () => {
            await request(server)
                .post("/tasks/createtask")
                .send({
                    taskName: "fooo",
                    dueDate: "2024-05-30",
                    priority: "High",
                    courseid: courseid,
                    userid: userid,
                })
                .expect(201);
            await request(server)
                .post("/tasks/createtask")
                .send({
                    taskName: "bar",
                    dueDate: "2024-05-30",
                    priority: "Low",
                    courseid: courseid,
                    userid: userid,
                })
                .expect(201);
            await request(server)
                .post("/tasks/createtask")
                .send({
                    taskName: "baz",
                    dueDate: "2024-05-29",
                    priority: "Low",
                    courseid: courseid,
                    userid: userid,
                })
                .expect(201);
            expectedOrderByDate = ["baz", "fooo", "bar"];
            expectedOrderByPriority = ["fooo", "baz", "bar"];
        });
        it("can get tasks (sorted by date) for a user", async () => {
            const res = await request(server)
                .post("/tasks/gettasksbydateforuser")
                .send({ userid: userid })
                .expect(200);
            const taskOrder = res.body.map((task) => task.taskName);
            expect(taskOrder).toEqual(expectedOrderByDate);
        }),
            it("returns an error when getting tasks with an invalid user id", async () => {
                await request(server)
                    .post("/tasks/gettasksbydateforuser")
                    .send({ userid: "123" })
                    .expect(500);
            });

        it("can get tasks (sorted by priority) for a user", async () => {
            const res = await request(server)
                .post("/tasks/gettasksbypriorityforuser")
                .send({ userid: userid })
                .expect(200);
            const taskOrder = res.body.map((task) => task.taskName);
            expect(taskOrder).toEqual(expectedOrderByPriority);
        }),
            it("returns an error when getting tasks with an invalid user id", async () => {
                await request(server)
                    .post("/tasks/gettasksbypriorityforuser")
                    .send({ userid: "123" })
                    .expect(500);
            });

        it("can get tasks (sorted by date) for a course", async () => {
            const res = await request(server)
                .post("/tasks/gettasksbydateforcourse")
                .send({ courseid: courseid })
                .expect(200);
            const taskOrder = res.body.map((task) => task.taskName);
            expect(taskOrder).toEqual(expectedOrderByDate);
        }),
            it("returns an error when getting tasks with an invalid course id", async () => {
                await request(server)
                    .post("/tasks/gettasksbydateforcourse")
                    .send({ courseid: "123" })
                    .expect(500);
            });

        it("can get tasks (sorted by priority) for a course", async () => {
            const res = await request(server)
                .post("/tasks/gettasksbypriorityforcourse")
                .send({ courseid: courseid })
                .expect(200);
            const taskOrder = res.body.map((task) => task.taskName);
            expect(taskOrder).toEqual(expectedOrderByPriority);
        }),
            it("returns an error when getting tasks with an invalid course id", async () => {
                await request(server)
                    .post("/tasks/gettasksbypriorityforcourse")
                    .send({ courseid: "123" })
                    .expect(500);
            });
    });
});
