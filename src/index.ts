const dotenv = require("dotenv");
dotenv.config();

process.on('uncaughtException', (err) => {
    console.log(err?.name, err?.message);
    console.log('UNHANDLED EXCEPTION! 🔥 Shutting down...');
    process.exit(1);
});

import express, {Request, Response, NextFunction} from "express";
import AppError from "./utils/AppError";

import connectDB from "./db/dbConnection";
import errorHandler from "./controllers/errorController";

connectDB().then(() => {
    console.log("Connected to MongoDB");
});

const app = express();
const port = process.env.PORT || 5050;

app.use(express.json());
app.use("/article", require("./routes/articleRoutes"));

app.all("*", (reg: Request, res: Response, next: NextFunction) => {
    const err = new AppError(`Can't find ${reg.originalUrl}`, 404)
    next(err);
});

app.use(errorHandler);

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

process.on('unhandledRejection', (err: any) => {
    console.log(err?.name, err?.message);
    console.log('UNHANDLED REJECTION! 🔥 Shutting down...');
    server.close(() => {
        process.exit(1);
    })
});

