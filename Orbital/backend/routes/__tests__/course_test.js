const request = require("supertest");
const app = require("../../app");
const Course = require("../../models/courseModel");
const User = require("../../models/userModel");
const Task = require("../../models/tasksModel");

// Access Test Database
const mongoose = require("mongoose");
var mongoDB =
    "mongodb+srv://Smiley:6310-Smiley@6310-smiley.yxgidpp.mongodb.net/integrationTestingCourse?retryWrites=true&w=majority&appName=6310-Smiley";

const PORT = 8002;

let server;
let userid;

beforeAll(async () => {
    mongoose
        .connect(mongoDB)
        .then(() => console.log("Test Database connected successfully"))
        .catch((err) => console.log("Test Database connection failed", err));
    await Course.deleteMany({});
    await User.deleteMany({});
    server = app.listen(PORT);
});

afterAll(async () => {
    mongoose.connection.close();
    server.close();
});

describe("course route testing", () => {
    beforeAll(async () => {
        const res = await request(server).post("/api/signup").send({
            name: "foo",
            email: "foo@gmail.com",
            password: "Foobar123",
        });
        userid = res.body.id;
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Course.deleteMany({});
    });

    it("can create a course", async () => {
        await request(server)
            .post("/courses/createcourse")
            .send({
                courseName: "bar",
                courseCode: "BAR123",
                userid: userid,
                courseOrder: ["temp"],
                tasks: [],
            })
            .expect(201);
    }),
        it("returns an error when creating a course with an empty course code input", async () => {
            await request(server)
                .post("/courses/createcourse")
                .send({
                    courseName: "bar",
                    courseCode: "",
                    userid: userid,
                    courseOrder: ["temp"],
                    tasks: [],
                })
                .expect(422);
        }),
        it("returns an error when creating a course with an invalid course code input", async () => {
            await request(server)
                .post("/courses/createcourse")
                .send({
                    courseName: "bar",
                    courseCode: "bar",
                    userid: userid,
                    courseOrder: ["temp"],
                    tasks: [],
                })
                .expect(422);
        }),
        it("returns an error when creating a course with an existing course code", async () => {
            await request(server)
                .post("/courses/createcourse")
                .send({
                    courseName: "bar",
                    courseCode: "BAR123",
                    userid: userid,
                    courseOrder: ["temp"],
                    tasks: [],
                })
                .expect(400);
        }),
        it("returns an error when creating a course with an empty course name input", async () => {
            await request(server)
                .post("/courses/createcourse")
                .send({
                    courseName: "",
                    courseCode: "BAR123",
                    userid: userid,
                    courseOrder: ["temp"],
                    tasks: [],
                })
                .expect(422);
        });

    it("can return a list of all courses", async () => {
        await request(server)
            .post("/courses/getcourses")
            .send({
                userid: userid,
            })
            .expect(200);
    }),
        it("returns an error when getting courses with an invalid user id", async () => {
            await request(server)
                .post("/courses/getcourses")
                .send({
                    userid: "123",
                })
                .expect(500);
        });

    it("can delete a course", async () => {
        const course = await Course.findOne({ courseName: "bar" });
        const courseid = course._id;
        await request(server)
            .delete(`/courses/deletecourse/${courseid}`)
            .send({ courseid: courseid })
            .expect(200);
    }),
        it("returns an error when deleting a course with an invalid course id", async () => {
            await request(server)
                .delete("/courses/deletecourse/123")
                .send({ courseid: "123" })
                .expect(500);
        });
    // it("deletes all corresponding tasks when a course is deleted", async () => {});

    it("should create recurring tasks successfully when a new course is created", async () => {
        await request(server)
            .post("/courses/createcourse")
            .send({
                courseName: "foobar",
                courseCode: "FB123",
                userid: userid,
                courseOrder: ["temp"],
                tasks: [
                    {
                        recurringTaskName: "Read Chapter 1",
                        recurringTaskPriorityLevel: "High",
                        reminderDay: "Monday",
                        reminderFrequency: "Weekly",
                        reminderNumberOfRepeats: 13,
                    },
                ],
            })
            .expect(201);

        // Verify the course was created
        const course = await Course.findOne({ courseCode: "FB123" });
        expect(course).not.toBeNull();

        // Verify the task was created with the correct recurrence
        const tasks = await Task.find({ course: course._id });
        expect(tasks.length).toEqual(13);
        const refDate = new Date();
        refDate.setHours(0, 0, 0, 0);
        // Set refDate to the nearest Monday
        refDate.setDate(refDate.getDate() + ((1 + 7 - refDate.getDay()) % 7));
        tasks.forEach((task) => {
            expect(task.taskName).toEqual("Read Chapter 1");
            expect(task.priority).toEqual("High");
            expect(task.dueDate).toEqual(refDate);
            // Increment refDate by 7 days
            refDate.setDate(refDate.getDate() + 7);
        });
    });
});
