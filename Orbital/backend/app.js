var express = require("express");
const app = express();
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var cors = require("cors");

require("dotenv").config();

// Routes
const TaskRoute = require("./routes/task");
const UserRoute = require("./routes/user");
const AuthRoute = require("./routes/auth");
const courseRoute = require("./routes/course");
const notificationsRoute = require("./routes/notifications");

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Calling the routes
app.use("/user", UserRoute);
app.use("/api", AuthRoute);
app.use("/tasks", TaskRoute);
app.use("/courses", courseRoute);
app.use("/notifications", notificationsRoute);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

module.exports = app;
