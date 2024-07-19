const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
import connectDB from "./db/dbConnection";
// const connectDB = require('./db/dbConnection');
const express = require("express");

connectDB().then(() => {
    console.log("Connected to MongoDB");
});

const app = express();
const port = process.env.PORT || 5050;

app.use(express.json());
app.use("/article", require("./routes/articleRoutes"));

mongoose.connection.once("open", () => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
