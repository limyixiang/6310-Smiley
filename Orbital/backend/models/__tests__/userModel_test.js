const mongoose = require("mongoose");
var mongoDB =
    "mongodb+srv://Smiley:6310-Smiley@6310-smiley.yxgidpp.mongodb.net/integrationTesting?retryWrites=true&w=majority&appName=6310-Smiley";
mongoose
    .connect(mongoDB)
    .then(() => console.log("Test Database connected successfully"))
    .catch((err) => console.log("Test Database connection failed", err));
const User = require("../userModel");

describe("User Model Test", () => {
    beforeAll(async () => {
        await User.deleteMany({});
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("has a module", () => {
        expect(User).toBeDefined();
    });

    describe("save user", () => {
        it("saves a user", async () => {
            const user = new User({
                name: "foo",
                email: "foo@gmail.com",
                encrypted_password: "123456",
            });
            const savedUser = await user.save();
            const expected = "foo";
            const actual = savedUser.name;
            expect(actual).toEqual(expected);
        });
    });

    describe("get user", () => {
        it("gets a user", async () => {
            const user = new User({
                name: "foo",
                email: "foo@gmail.com",
                encrypted_password: "123456",
            });
            await user.save();

            const foundUser = await User.findOne({ name: "foo" });
            const expected = "foo";
            const actual = foundUser.name;
            expect(actual).toEqual(expected);
        });
    });

    describe("update user", () => {
        it("updates a user", async () => {
            const user = new User({
                name: "foo",
                email: "foo@gmail.com",
                encrypted_password: "123456",
            });
            await user.save();
            user.name = "bar";
            const updatedUser = await user.save();
            const expected = "bar";
            const actual = updatedUser.name;
            expect(actual).toEqual(expected);
        });
    });
});
