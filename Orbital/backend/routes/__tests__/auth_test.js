const request = require("supertest");
const app = require("../../app");
const User = require("../../models/userModel");

// Access Test Database
const mongoose = require("mongoose");
var mongoDB =
    "mongodb+srv://Smiley:6310-Smiley@6310-smiley.yxgidpp.mongodb.net/integrationTestingAuth?retryWrites=true&w=majority&appName=6310-Smiley";

const PORT = 8001;

let server;

beforeAll(async () => {
    mongoose
        .connect(mongoDB)
        .then(() => console.log("Test Database connected successfully"))
        .catch((err) => console.log("Test Database connection failed", err));
    await User.deleteMany({});
    server = app.listen(PORT);
});

afterAll(async () => {
    await User.deleteMany({});
    mongoose.connection.close();
    server.close();
});

describe("auth route testing", () => {
    it("can sign up a user", async () => {
        await request(server)
            .post("/api/signup")
            .send({
                name: "foo",
                email: "foo@gmail.com",
                password: "Foobar123",
            })
            .expect(200);
    }),
        it("returns an error when signing up with an existing email", async () => {
            await request(server)
                .post("/api/signup")
                .send({
                    name: "foobar",
                    email: "foo@gmail.com",
                    password: "Foobar123456",
                })
                .expect(500);
        }),
        it("returns an error when signing up with an invalid email", async () => {
            await request(server)
                .post("/api/signup")
                .send({
                    name: "foobar",
                    email: "invalid-email",
                    password: "Foobar123456",
                })
                .expect(422);
        }),
        it("returns an error when signing up with an invalid password", async () => {
            await request(server)
                .post("/api/signup")
                .send({
                    name: "foobar",
                    email: "valid-email@gmail.com",
                    password: "invalid-password-without-uppercase",
                })
                .expect(422);
        }),
        it("returns an error when signing up with an invalid name", async () => {
            await request(server)
                .post("/api/signup")
                .send({
                    name: "",
                    email: "missing-name@gmail.com",
                    password: "Foobar123",
                })
                .expect(422);
        });

    it("can sign in a user", async () => {
        await request(server)
            .post("/api/signin")
            .send({
                email: "foo@gmail.com",
                password: "Foobar123",
            })
            .expect(200);
    }),
        it("returns an error when signing in with an invalid email", async () => {
            await request(server)
                .post("/api/signin")
                .send({
                    email: "invalid-email",
                    password: "Foobar123",
                })
                .expect(422);
        }),
        it("returns an error when signing in with an invalid password", async () => {
            await request(server)
                .post("/api/signin")
                .send({
                    email: "foobar@gmail.com",
                    password: "",
                })
                .expect(422);
        }),
        it("returns an error when signing in with an unregistered email", async () => {
            await request(server)
                .post("/api/signin")
                .send({
                    email: "unregistered-email@gmail.com",
                    password: "Foobar123",
                })
                .expect(400);
        }),
        it("returns an error when signing in with an incorrect password", async () => {
            await request(server)
                .post("/api/signin")
                .send({
                    email: "foo@gmail.com",
                    password: "incorrect-password",
                })
                .expect(401);
        });

    it("can sign out a user", async () => {
        await request(server).get("/api/signout").expect(200);
    });

    it("can send a request for user to forget password", async () => {
        await request(server)
            .post("/api/forgetpassword")
            .send({
                email: "foo@gmail.com",
            })
            .expect(200);
    }),
        it("returns an error when sending a request for user to forget password with an invalid email", async () => {
            await request(server)
                .post("/api/forgetpassword")
                .send({
                    email: "invalid-email",
                })
                .expect(422);
        }),
        it("returns an error when sending a request for user to forget password with an unregistered email", async () => {
            await request(server)
                .post("/api/forgetpassword")
                .send({
                    email: "unregistered-user@gmail.com",
                })
                .expect(404);
        });

    it("can reset a password for the user", async () => {
        const res = await request(server).post("/api/forgetpassword").send({
            email: "foo@gmail.com",
        });
        const token = res.body.token;
        await request(server)
            .post(`/api/resetpassword/${token}`)
            .send({
                password: "Foobar123",
            })
            .expect(200);
    }),
        it("returns an error when resetting a password with an invalid token", async () => {
            await request(server)
                .post(`/api/resetpassword/invalid-token`)
                .send({
                    password: "Foobar123",
                })
                .expect(401);
        }),
        it("returns an error when resetting a password with an invalid password", async () => {
            const res = await request(server).post("/api/forgetpassword").send({
                email: "foo@gmail.com",
            });
            const token = res.body.token;
            await request(server)
                .post(`/api/resetpassword/${token}`)
                .send({
                    password: "invalid-password-without-uppercase",
                })
                .expect(422);
        });
});
