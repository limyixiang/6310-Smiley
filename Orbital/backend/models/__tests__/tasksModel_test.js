const mongoose = require("mongoose");
var mongoDB =
    "mongodb+srv://Smiley:6310-Smiley@6310-smiley.yxgidpp.mongodb.net/integrationTesting?retryWrites=true&w=majority&appName=6310-Smiley";
mongoose
    .connect(mongoDB)
    .then(() => console.log("Test Database connected successfully"))
    .catch((err) => console.log("Test Database connection failed", err));
const Task = require("../tasksModel");

describe("Task Model Test", () => {
    beforeAll(async () => {
        await Task.deleteMany({});
    });

    afterEach(async () => {
        await Task.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("has a module", () => {
        expect(Task).toBeDefined();
    });

    describe("save task", () => {
        it("saves a task", async () => {
            const task = new Task({
                taskName: "foo",
                description: "foo description",
                dueDate: "2024-05-05",
                priority: "High",
            });
            const savedTask = await task.save();
            const expected = "foo";
            const actual = savedTask.taskName;
            expect(actual).toEqual(expected);
        });
    });

    describe("get task", () => {
        it("gets a task", async () => {
            const task = new Task({
                taskName: "foo",
                description: "foo description",
                dueDate: "2024-05-05",
                priority: "High",
            });
            await task.save();

            const foundTask = await Task.findOne({ taskName: "foo" });
            const expected = "foo";
            const actual = foundTask.taskName;
            expect(actual).toEqual(expected);
        });
    });

    describe("update task", () => {
        it("updates a task", async () => {
            const task = new Task({
                taskName: "foo",
                description: "foo description",
                dueDate: "2024-05-05",
                priority: "High",
            });
            await task.save();

            task.taskName = "bar";
            const updatedTask = await task.save();
            const expected = "bar";
            const actual = updatedTask.taskName;
            expect(actual).toEqual(expected);
        });
    });

    describe("delete task", () => {
        it("deletes a task", async () => {
            const task = new Task({
                taskName: "foo",
                description: "foo description",
                dueDate: "2024-05-05",
                priority: "High",
            });
            await task.save();
            await Task.findOneAndDelete({ taskName: "foo" });
            const deletedTask = await Task.findOne({ taskName: "foo" });
            expect(deletedTask).toBeNull();
        });
    });

    describe("complete task", () => {
        it("completes a task", async () => {
            const task = new Task({
                taskName: "foo",
                description: "foo description",
                dueDate: "2024-05-05",
                priority: "High",
            });
            await task.save();

            task.status = "Done";
            await task.save();
            const updatedTask = await Task.findOne({ taskName: "foo" });
            const expected = "Done";
            const actual = updatedTask.status;
            expect(actual).toEqual(expected);
        });
    });
});
