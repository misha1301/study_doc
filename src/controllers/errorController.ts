import {NextFunction, Request, Response} from "express";
import clientErrorStrategy from "../utils/errorStrategies";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, req, res);
    } else {
        let error = {...err};
        error.message = err.message;
        error.name = err.name;

        if (err.code === 11000)
            error.name = "MongoDuplicateError"

        const clientError = clientErrorStrategy
            .getAppError(error.name, err, req.t);

        if (clientError)
            error = clientError;

        sendErrorProd(error, req, res);
    }
}

const sendErrorDev = (err: any, req: Request, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message?.startsWith('errors:') ? req.t(err.message) : err.message,
        error: err,
        stack: err.stack
    });
}

const sendErrorProd = (err: any, req: Request, res: Response) => {
    // console.log(err)
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message?.startsWith('errors:') ? req.t(err.message) : err.message
        });
    } else {
        console.error("Error 🔥", err);

        res.status(500).json({
            status: "error",
            message: req.t("errors:server.UNKNOWN_ERROR")
        });
    }
}

export default errorHandler;