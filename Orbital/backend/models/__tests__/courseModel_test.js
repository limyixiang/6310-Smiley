const mongoose = require("mongoose");
var mongoDB =
    "mongodb+srv://Smiley:6310-Smiley@6310-smiley.yxgidpp.mongodb.net/integrationTesting?retryWrites=true&w=majority&appName=6310-Smiley";
mongoose
    .connect(mongoDB)
    .then(() => console.log("Test Database connected successfully"))
    .catch((err) => console.log("Test Database connection failed", err));
const Course = require("../courseModel");

describe("Course Model Test", () => {
    beforeAll(async () => {
        await Course.deleteMany({});
    });

    afterEach(async () => {
        await Course.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("has a module", () => {
        expect(Course).toBeDefined();
    });

    describe("save course", () => {
        it("saves a course", async () => {
            const course = new Course({
                courseName: "foo",
                courseCode: "foo",
            });
            const savedCourse = await course.save();
            const expected = "foo";
            const actual = savedCourse.courseName;
            expect(actual).toEqual(expected);
        });
    });

    describe("get course", () => {
        it("gets a course", async () => {
            const course = new Course({
                courseName: "foo",
                courseCode: "foo",
            });
            await course.save();

            const foundCourse = await Course.findOne({ courseName: "foo" });
            const expected = "foo";
            const actual = foundCourse.courseName;
            expect(actual).toEqual(expected);
        });
    });

    describe("update course", () => {
        it("updates a course", async () => {
            const course = new Course({
                courseName: "foo",
                courseCode: "foo",
            });
            await course.save();
            course.courseName = "bar";
            const updatedCourse = await course.save();
            const expected = "bar";
            const actual = updatedCourse.courseName;
            expect(actual).toEqual(expected);
        });
    });

    describe("delete course", () => {
        it("deletes a course", async () => {
            const course = new Course({
                courseName: "foo",
                courseCode: "foo",
            });
            await course.save();
            await Course.findOneAndDelete({ courseName: "foo" });
            const deletedCourse = await Course.findOne({ courseName: "foo" });
            expect(deletedCourse).toBeNull();
        });
    });
});
