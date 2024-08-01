const dotenv = require("dotenv");
dotenv.config();

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('UNHANDLED EXCEPTION! 🔥 Shutting down...');
    process.exit(1);
});

import express, {Request, Response, NextFunction} from "express";
import mongoose from 'mongoose';
import {rateLimit} from 'express-rate-limit';
import helmet from "helmet";
import hpp from "hpp";

import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';

import cors from "cors";
import mongoSanitize from 'express-mongo-sanitize';
import AppError from "./utils/AppError";
import cookieParser from 'cookie-parser';

import connectDB from "./db/dbConnection";
import errorHandler from "./controllers/errorController";

connectDB().then(() => {
    console.log("Connected to MongoDB");
});

const app = express();
const PORT = process.env.PORT || 5050;

// app.use(cors());

//Set security HTTP headers
app.use(helmet());

const limiter = rateLimit({
    limit: 100,
    windowMs: 15 * 60 * 1000,
    message: "To many requests from your IP, please try again in an hour"
})

i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        fallbackLng: 'en',
        lng: 'en',
        ns: ["translation"],
        defaultNS: "translation",
        backend: {
            loadPath: "./locales/{{lng}}/{{ns}}.json",
        },
        detection: {
            lookupHeader: "accept-language",
        }
    })

app.use(i18nextMiddleware.handle(i18next));

//Limit requests from single IP
app.use('/', limiter);

app.use(cookieParser());
app.use(express.json({limit: '10kb'}));

//DAta sanitization against NoSQL query injection
app.use(mongoSanitize());

//Prevent parameter pollution
app.use(hpp(
    {
        whitelist: [
            "numberOfSavings",
            "numberOfReviews"
        ]
    }
));

app.use("/articles", require("./routes/articleRoutes"));
app.use("/users", require("./routes/userRoutes"));

app.all("*", (reg: Request, res: Response, next: NextFunction) => {
    const err = new AppError(`Can't find ${reg.originalUrl}`, 404)
    next(err);
});

app.use(errorHandler);

const server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// mongoose.connection.once("open", () => {
//     server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
// });

process.on('unhandledRejection', (err: any) => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! 🔥 Shutting down...');
    server.close(() => {
        process.exit(1);
    })
});

export default app;

