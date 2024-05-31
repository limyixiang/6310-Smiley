var express = require("express");
const app = express();
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var cors = require("cors");

require("dotenv").config();

//Routes
const TaskRoute = require("./routes/task");
const UserRoute = require("./routes/user");
const AuthRoute = require("./routes/auth");
const courseRoute = require("./routes/course");

//Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
// app.use(
//     cors({
//         origin: ["localhost:3000", "localhost:8000"],
//         // origin: ["https://6310-smiley.vercel.app/", "", "localhost:3000"],
//         // methods: ["POST", "GET", "DELETE"],
//         credentials: true,
//     })
// );

//Calling the routes
app.use("/api", AuthRoute);
app.use("/tasks", TaskRoute);
app.use("/courses", courseRoute);

module.exports = app;
