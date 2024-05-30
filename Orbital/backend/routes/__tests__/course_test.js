const request = require("supertest");
const app = require("../../app");
const Course = require("../../models/courseModel");
const User = require("../../models/userModel");

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
                courseCode: "foo",
                userid: userid,
            })
            .expect(201);
    }),
        it("returns an error when creating a course with an empty course code input", async () => {
            await request(server)
                .post("/courses/createcourse")
                .send({
                    courseName: "foo",
                    courseCode: "",
                    userid: userid,
                })
                .expect(422);
        }),
        it("returns an error when creating a course with an empty course name input", async () => {
            await request(server)
                .post("/courses/createcourse")
                .send({
                    courseName: "",
                    courseCode: "foo",
                    userid: userid,
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
});
