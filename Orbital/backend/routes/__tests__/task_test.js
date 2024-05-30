const request = require("supertest");
const app = require("../../app");
const Task = require("../../models/tasksModel");
const Course = require("../../models/courseModel");
const User = require("../../models/userModel");

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
    mongoose.connection.close();
    server.close();
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
                        courseCode: "foo",
                        userid: userid,
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
                dueDate: "05-30-2024",
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
                    dueDate: "05-30-2024",
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
                    dueDate: "05-30-2024",
                    priority: "",
                    courseid: courseid,
                    userid: userid,
                })
                .expect(422);
        });

    it("can get tasks for a user", async () => {
        await request(server)
            .post("/tasks/gettasksforuser")
            .send({ userid: userid })
            .expect(200);
    }),
        it("returns an error when getting tasks with an invalid user id", async () => {
            await request(server)
                .post("/tasks/gettasksforuser")
                .send({ userid: "123" })
                .expect(500);
        });

    it("can get tasks for a course", async () => {
        await request(server)
            .post("/tasks/gettasksforcourse")
            .send({ courseid: courseid })
            .expect(200);
    }),
        it("returns an error when getting tasks with an invalid course id", async () => {
            await request(server)
                .post("/tasks/gettasksforcourse")
                .send({ courseid: "123" })
                .expect(500);
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
});
