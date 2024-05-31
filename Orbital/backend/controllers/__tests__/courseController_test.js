const Course = require("../../models/courseModel");
const CourseController = require("../courseController");
const sinon = require("sinon");

describe("Course Controller Test", () => {
    it("has a module", () => {
        expect(CourseController).toBeDefined();
    });

    // this is still a work in progress, i dont think its supposed to work like that
    describe("list courses", () => {
        it("returns a list of courses", async () => {
            // Create a stub for the Course.find method
            const stubValue = [
                {
                    courseName: "foo",
                    courseCode: "foo",
                },
            ];
            const findStub = sinon.stub(Course, "find");
            findStub.returns(stubValue);

            // Create a stub for the CourseController.getCourses method
            const getCoursesStub = sinon.stub(CourseController, "getCourses");
            getCoursesStub.returns(stubValue);

            // Call the method
            const courses = await CourseController.getCourses();

            // Assert that the stub was called and the result is as expected
            sinon.assert.calledOnce(getCoursesStub);
            expect(courses).toEqual(stubValue);

            // Restore the stubs
            findStub.restore();
            getCoursesStub.restore();
        });
    });
});
