import {NextFunction, Request, Response} from "express";
import clientErrorStrategy from "../utils/errorStrategies";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else {
        let error = {...err};

        if(err.code === 11000)
            error.name = "MongoDuplicateError"

        const clientError = clientErrorStrategy.getAppError(error.name || err.name, err);

        if(clientError)
            error = clientError;

        sendErrorProd(error, res);
    }
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

export default errorHandler;