var express = require('express');
const app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

//Routes
const TaskRoute = require("./routes/task");
const UserRoute = require("./routes/user");
const AuthRoute = require("./routes/auth");
const courseRoute = require("./routes/course");

//Database connection
mongoose.connect("mongodb+srv://Smiley:6310-Smiley@6310-smiley.yxgidpp.mongodb.net/?retryWrites=true&w=majority&appName=6310-Smiley")
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.log("Database connection failed", err));


//Starting the application
const port = 8000;

app.listen(port,() => {
    console.log(`app is running at ${port}`)
})


//Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Calling the routes
app.use("/api", AuthRoute);
app.use("/tasks", TaskRoute);
app.use("/courses", courseRoute);
