import {NextFunction, Request, Response} from "express";
import AppError from "../utils/AppError";
import { Error as MongooseError } from 'mongoose';

const handleCastErrorDB = (err: MongooseError.CastError) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = (err: MongooseError.ValidatorError) => {
    return new AppError(err.message, 400);
}

const handleDuplicateErrorDB = (err: any) => {
    const duplicateField = err.message.match(/[^{\}]+(?=})/g);
    const message = `Duplicated field: {${duplicateField}}`;
    return new AppError(message, 400);
}
 
const sendErrorDev = (err: any, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
}

const sendErrorProd = (err: any, res: Response) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        console.error("Error 🔥", err);

        res.status(500).json({
            status: "error",
            message: "Unknown server error!"
        });
    }
}

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else {
        let error = {...err};
        if(err.name === "CastError") error = handleCastErrorDB(err);
        if(err.name === "ValidationError") error = handleValidationErrorDB(err);
        if(err.code === 11000) error = handleDuplicateErrorDB(err);

        sendErrorProd(error, res);
    }
}

export default errorHandler;