const mongoose = require("mongoose");
const app = require("./app");

// Database connection
console.log("Attempting to connect to database...");
mongoose
    .connect(
        process.env.MONGODB_URI ||
            "mongodb+srv://Smiley:6310-Smiley@6310-smiley.yxgidpp.mongodb.net/?retryWrites=true&w=majority&appName=6310-Smiley"
    )
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.log("Database connection failed", err));

// Starting the application
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`app is running at ${port}`);
});
